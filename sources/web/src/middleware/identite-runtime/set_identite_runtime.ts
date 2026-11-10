//

import { identite_runtime, type IdentiteRuntime } from "#src/lib/activities";
import type { Env, MiddlewareHandler } from "hono";
import type { AuthorizedContext } from "../auth";
import type { IdentiteProconnectPgContext } from "../identite-pg";

//

export function set_identite_runtime(): MiddlewareHandler<
  AuthorizedContext & IdentiteProconnectPgContext & IdentiteRuntimeContext
> {
  return async function set_identite_runtime_middleware(
    { set, var: { identite_pg, userinfo } },
    next,
  ) {
    set(
      "identite_runtime",
      identite_runtime(identite_pg).as({
        sub: userinfo.sub,
        type: "moderator",
      }),
    );
    await next();
  };
}

//

export interface IdentiteRuntimeContext extends Env {
  Variables: {
    identite_runtime: IdentiteRuntime;
  };
}
