//

import type { AppConfig } from "#src/config";
import { app_env } from "#src/config";
import type { Env, MiddlewareHandler } from "hono";
import { env } from "hono/adapter";

//

export function set_config(
  value?: Partial<AppConfig>,
): MiddlewareHandler<ConfigVariablesContext> {
  if (value) {
    return async function set_config_middleware({ set }, next) {
      set("config", value as AppConfig);
      await next();
    };
  }

  return async function set_config_middleware(c, next) {
    const { set } = c;
    const app_config = app_env.parse(env(c));
    const ASSETS_PATH = `/assets/${app_config.VERSION}` as const;
    const PUBLIC_ASSETS_PATH =
      `/assets/${app_config.VERSION}/public/built` as const;

    set("config", { ...app_config, ASSETS_PATH, PUBLIC_ASSETS_PATH });
    await next();
  };
}

//

export interface ConfigVariablesContext extends Env {
  Variables: {
    readonly config: AppConfig;
  };
}
