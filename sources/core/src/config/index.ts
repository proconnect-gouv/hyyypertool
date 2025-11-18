//

import type { Env } from "hono";
import type { AppEnv } from "./env";
import env from "./env";

//

export type AppConfig = AppEnv & {
  ASSETS_PATH: string;
  PUBLIC_ASSETS_PATH: string;
};

export function create_app_config(app_env: AppEnv): AppConfig {
  return {
    ...app_env,
    ASSETS_PATH: `/assets/${app_env.VERSION}` as const,
    PUBLIC_ASSETS_PATH: `/assets/${app_env.VERSION}/public/built` as const,
  };
}

const ASSETS_PATH = `/assets/${env.VERSION}` as const;
const PUBLIC_ASSETS_PATH = `/assets/${env.VERSION}/public/built` as const;

export default { ...env, ASSETS_PATH, PUBLIC_ASSETS_PATH };

//

export interface AppVariables_Context extends Env {
  Variables: {
    readonly nonce: string;
    readonly page_title: string;
    readonly config: AppConfig;
  };
}
export interface AppEnv_Context extends Env {
  Bindings: {
    ASSETS_PATH: typeof ASSETS_PATH;
    PUBLIC_ASSETS_PATH: typeof PUBLIC_ASSETS_PATH;
  } & AppEnv;

  Variables: {
    readonly nonce: string;
    readonly config: AppConfig;
  };
}
