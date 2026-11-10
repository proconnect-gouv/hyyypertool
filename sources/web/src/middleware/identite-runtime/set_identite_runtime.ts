//

import { is_htmx_request, type HtmxHeader } from "#src/htmx";
import { identite_runtime, type IdentiteRuntime } from "#src/lib/activities";
import type { Env, MiddlewareHandler } from "hono";
import type { UserInfoVariablesContext } from "../auth";
import type { IdentiteProconnectPgContext } from "../identite-pg";
import type { SessionContext } from "../session";

//

export function set_identite_runtime(): MiddlewareHandler<
  IdentiteProconnectPgContext &
    IdentiteRuntimeContext &
    SessionContext &
    UserInfoVariablesContext
> {
  return async function set_identite_runtime_middleware(c, next) {
    const { userinfo } = c.var;

    if (!userinfo) {
      c.var.session.deleteSession();
      if (is_htmx_request(c.req.raw)) {
        return c.text("Unauthorized", 401, {
          "HX-Location": "/",
        } as HtmxHeader);
      }
      return c.redirect("/");
    }

    c.set(
      "identite_runtime",
      identite_runtime(c.var.identite_pg).as({
        sub: userinfo.sub,
        type: "moderator",
      }),
    );
    return next();
  };
}

//

export interface IdentiteRuntimeContext extends Env {
  Variables: {
    identite_runtime: IdentiteRuntime;
  };
}
