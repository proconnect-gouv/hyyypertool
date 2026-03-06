//

import type { AppEnvContext } from "#src/config";
import { CrispApi, type CrispApi as CrispApiType } from "#src/lib/crisp";
import consola, { LogLevels } from "consola";
import type { Env, MiddlewareHandler } from "hono";

//

export function set_crisp_client(
  client: CrispApiType,
): MiddlewareHandler<CrispClientContext> {
  return async function set_crisp_client_middleware({ set }, next) {
    set("crisp", client);
    await next();
  };
}

export function set_crisp_client_from_config(): MiddlewareHandler<
  AppEnvContext & CrispClientContext
> {
  let client: CrispApiType | null = null;

  return async function set_crisp_client_from_config_middleware(c, next) {
    if (!client) {
      client = CrispApi({
        base_url: c.env.CRISP_BASE_URL,
        identifier: c.env.CRISP_IDENTIFIER,
        key: c.env.CRISP_KEY,
        plugin_urn: c.env.CRISP_PLUGIN_URN,
        user_nickname: c.env.CRISP_USER_NICKNAME,
        website_id: c.env.CRISP_WEBSITE_ID,
        debug: consola.level >= LogLevels.debug,
      });
    }
    c.set("crisp", client);
    await next();
  };
}

//

export interface CrispClientContext extends Env {
  Variables: {
    crisp: CrispApiType;
  };
}
