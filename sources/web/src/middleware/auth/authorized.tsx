//

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

type AuthorizedContext = HyyyperbasePgContext &
  HyyyperUserContext &
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

      let db_user: HyyyperUser | undefined;
      db_user = await find_by_sub_email_pair(c.var.hyyyper_pg, {
        sub,
        email,
      }).catch(() => undefined);

      // 2. Migration path: lookup by email, backfill sub
      if (!db_user) {
        db_user = await find_active_user(c.var.hyyyper_pg, email).catch(
          () => undefined,
        );
        if (db_user) {
          await backfill_sub(c.var.hyyyper_pg, db_user.id, sub);
        }
      }

      if (!db_user) {
        c.status(401);
        return c.render(<NotAuthorized />);
      }

      c.set("hyyyper_user", db_user);

      return next();
    },
  );
}

//

async function find_by_sub_email_pair(
  db: HyyyperPgDatabase,
  { sub, email }: { sub: string; email: string },
): Promise<HyyyperUser | undefined> {
  const user = await db.query.users.findFirst({
    where: (users, { eq, isNull, and }) =>
      and(
        eq(users.email, email),
        eq(users.sub, sub),
        isNull(users.disabled_at),
      ),
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
