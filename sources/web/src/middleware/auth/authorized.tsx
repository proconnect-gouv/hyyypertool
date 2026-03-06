//

import type { AppEnvContext } from "#src/config";
import { is_htmx_request, type HtmxHeader } from "#src/htmx";
import type { HyyyperPgDatabase } from "@~/hyyyperbase";
import { createMiddleware } from "hono/factory";
import type { HyyyperbasePgContext } from "../hyyyperbase";
import { NotAuthorized } from "./NotAuthorized";
import type { UserInfoVariablesContext } from "./set_userinfo";

//

type AuthorizedContext = AppEnvContext &
  HyyyperbasePgContext &
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
      const is_allowed =
        is_in_allowed_users(allowed_users, userinfo.email) ||
        (await is_active_user(c.var.hyyyper_pg, userinfo.email).catch(
          () => false,
        ));

      if (!is_allowed) {
        c.status(401);
        return c.render(<NotAuthorized />);
      }

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

async function is_active_user(
  db: HyyyperPgDatabase,
  email: string,
): Promise<boolean> {
  const user = await db.query.users.findFirst({
    where: (users, { eq, isNull, and }) =>
      and(eq(users.email, email), isNull(users.disabled_at)),
    columns: { id: true },
  });
  return !!user;
}
