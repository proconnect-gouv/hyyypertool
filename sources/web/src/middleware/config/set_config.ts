//

import type { App_Config } from "#src/config";
import { app_env } from "#src/config/env";
import type { Env, MiddlewareHandler } from "hono";
import { env } from "hono/adapter";

//

export function set_config(
  value?: Partial<App_Config>,
): MiddlewareHandler<ConfigVariables_Context> {
  if (value) {
    return async function set_config_middleware({ set }, next) {
      set("config", value as App_Config);
      await next();
    };
  }

  return async function set_config_middleware(c, next) {
    const { set } = c;
    const app_config = app_env.parse(env(c), {
      path: ["env"],
    });
    const ASSETS_PATH = `/assets/${app_config.VERSION}` as const;
    const PUBLIC_ASSETS_PATH =
      `/assets/${app_config.VERSION}/public/built` as const;

    set("config", { ...app_config, ASSETS_PATH, PUBLIC_ASSETS_PATH });
    await next();
  };
}

//

export interface ConfigVariables_Context extends Env {
  Variables: {
    readonly config: App_Config;
  };
}
