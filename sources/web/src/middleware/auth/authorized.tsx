//

import type { AppEnvContext } from "#src/config";
import { is_htmx_request, type HtmxHeader } from "#src/htmx";
import { schema, type HyyyperPgDatabase, type Roles } from "@~/hyyyperbase";
import { and, eq, isNull } from "drizzle-orm";
import type { Env } from "hono";
import { createMiddleware } from "hono/factory";
import type { HyyyperbasePgContext } from "../hyyyperbase";
import { NotAuthorized } from "./NotAuthorized";
import type { UserInfoVariablesContext } from "./set_userinfo";

//

export interface HyyyperUser {
  id: number;
  role: Roles;
  email: string;
}

export interface HyyyperUserContext extends Env {
  Variables: {
    hyyyper_user: HyyyperUser;
  };
}

/** @deprecated Migrate route to guarantee a non-null hyyyper_user, then use {@link HyyyperUserContext} */
export interface PartialHyyyperUserContext extends Env {
  Variables: {
    hyyyper_user: HyyyperUser | undefined;
  };
}

type AuthorizedContext = AppEnvContext &
  HyyyperbasePgContext &
  PartialHyyyperUserContext &
  UserInfoVariablesContext;

export function authorized() {
  return createMiddleware<AuthorizedContext>(
    async function authorized_middleware(c, next) {
      const { userinfo } = c.var;

      if (!userinfo) {
        if (is_htmx_request(c.req.raw)) {
          return c.text("Unauthorized", 401, {
            "HX-Location": "/",
          } as HtmxHeader);
        }
        return c.redirect("/");
      }

      const { sub, email } = userinfo;
      const allowed_users = c.env.ALLOWED_USERS ?? "";
      const is_env_allowed = is_in_allowed_users(allowed_users, email);

      // 1. Lookup by sub (stable OIDC identifier)
      let db_user: HyyyperUser | undefined;
      if (sub) {
        db_user = await find_by_sub(c.var.hyyyper_pg, sub).catch(
          () => undefined,
        );
        if (db_user && db_user.email !== email) {
          await sync_email(c.var.hyyyper_pg, db_user.id, email);
        }
      }

      // 2. Migration path: lookup by email, backfill sub
      if (!db_user) {
        db_user = await find_active_user(
          c.var.hyyyper_pg,
          email,
        ).catch(() => undefined);
        if (db_user && sub) {
          await backfill_sub(c.var.hyyyper_pg, db_user.id, sub);
        }
      }

      if (!is_env_allowed && !db_user) {
        c.status(401);
        return c.render(<NotAuthorized />);
      }

      c.set("hyyyper_user", db_user);

      return next();
    },
  );
}

//

function is_in_allowed_users(allowed_users: string, email: string): boolean {
  return allowed_users
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean)
    .includes(email);
}

async function find_by_sub(
  db: HyyyperPgDatabase,
  sub: string,
): Promise<HyyyperUser | undefined> {
  const user = await db.query.users.findFirst({
    where: (users, { eq, isNull, and }) =>
      and(eq(users.sub, sub), isNull(users.disabled_at)),
    columns: { id: true, role: true, email: true },
  });
  return user as HyyyperUser | undefined;
}

async function find_active_user(
  db: HyyyperPgDatabase,
  email: string,
): Promise<HyyyperUser | undefined> {
  const user = await db.query.users.findFirst({
    where: (users, { eq, isNull, and }) =>
      and(eq(users.email, email), isNull(users.disabled_at)),
    columns: { id: true, role: true, email: true },
  });
  return user as HyyyperUser | undefined;
}

async function backfill_sub(
  db: HyyyperPgDatabase,
  id: number,
  sub: string,
): Promise<void> {
  await db
    .update(schema.users)
    .set({ sub })
    .where(and(eq(schema.users.id, id), isNull(schema.users.sub)));
}

async function sync_email(
  db: HyyyperPgDatabase,
  id: number,
  email: string,
): Promise<void> {
  await db
    .update(schema.users)
    .set({ email, updated_at: new Date() })
    .where(eq(schema.users.id, id));
}
