//

import type { ConfigVariables_Context } from "#src/middleware/config/set_config";
import type { Config } from "@~/crisp.lib/types";
import consola, { LogLevels } from "consola";
import type { Env, MiddlewareHandler } from "hono";

//

export function set_crisp_config(): MiddlewareHandler<
  ConfigVariables_Context & Crisp_Context
> {
  return function setset_crisp_config_middleware(
    { set, var: { config } },
    next,
  ) {
    set("crisp_config", {
      base_url: config.CRISP_BASE_URL,
      identifier: config.CRISP_IDENTIFIER,
      key: config.CRISP_KEY,
      plugin_urn: config.CRISP_PLUGIN_URN,
      user_nickname: config.CRISP_USER_NICKNAME,
      website_id: config.CRISP_WEBSITE_ID,
      debug: consola.level >= LogLevels.debug,
    });
    return next();
  };
}

//

export interface Crisp_Context extends Env {
  Variables: {
    crisp_config: Config;
  };
}
