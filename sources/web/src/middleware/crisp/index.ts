//

import { CrispApi, type CrispApi as CrispApiType } from "#src/lib/crisp";
import type { ConfigVariables_Context } from "#src/middleware/config";
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
  ConfigVariables_Context & CrispClientContext
> {
  let client: CrispApiType | null = null;

  return async function set_crisp_client_from_config_middleware(
    { set, var: { config } },
    next,
  ) {
    if (!client) {
      client = CrispApi({
        base_url: config.CRISP_BASE_URL,
        identifier: config.CRISP_IDENTIFIER,
        key: config.CRISP_KEY,
        plugin_urn: config.CRISP_PLUGIN_URN,
        user_nickname: config.CRISP_USER_NICKNAME,
        website_id: config.CRISP_WEBSITE_ID,
        debug: consola.level >= LogLevels.debug,
      });
    }
    set("crisp", client);
    await next();
  };
}

//

export interface CrispClientContext extends Env {
  Variables: {
    crisp: CrispApiType;
  };
}
