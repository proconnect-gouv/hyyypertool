//

import type { AppEnvContext } from "#src/config";
import { is_htmx_request, type HtmxHeader } from "#src/htmx";
import type { HyyyperPgDatabase, Roles } from "@~/hyyyperbase";
import type { Env } from "hono";
import { createMiddleware } from "hono/factory";
import type { HyyyperbasePgContext } from "../hyyyperbase";
import { NotAuthorized } from "./NotAuthorized";
import type { UserInfoVariablesContext } from "./set_userinfo";

//

export interface HyyyperUser {
  id: number;
  role: Roles;
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

      const allowed_users = c.env.ALLOWED_USERS ?? "";
      const is_env_allowed = is_in_allowed_users(allowed_users, userinfo.email);
      const db_user: HyyyperUser | undefined = await find_active_user(
        c.var.hyyyper_pg,
        userinfo.email,
      ).catch(() => undefined);

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

async function find_active_user(
  db: HyyyperPgDatabase,
  email: string,
): Promise<HyyyperUser | undefined> {
  const user = await db.query.users.findFirst({
    where: (users, { eq, isNull, and }) =>
      and(eq(users.email, email), isNull(users.disabled_at)),
    columns: { id: true, role: true },
  });
  return user as HyyyperUser | undefined;
}
