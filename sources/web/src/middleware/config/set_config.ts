//

import type { AppEnv, AppEnvContext } from "#src/config";
import type { MiddlewareHandler } from "hono";

//

export function set_config(
  value: Partial<AppEnv>,
): MiddlewareHandler<AppEnvContext> {
  return async function set_config_middleware(c, next) {
    c.env = value as AppEnv;
    await next();
  };
}
