//

import type { Env } from "hono";
import type { App_Env } from "./env";
import env from "./env";

//

const ASSETS_PATH = `/assets/${env.VERSION}` as const;
const PUBLIC_ASSETS_PATH = `/assets/${env.VERSION}/public/built` as const;

export default { ...env, ASSETS_PATH, PUBLIC_ASSETS_PATH };

export interface App_Config extends App_Env {
  ASSETS_PATH: typeof ASSETS_PATH;
  PUBLIC_ASSETS_PATH: typeof PUBLIC_ASSETS_PATH;
}

//

export interface AppVariables_Context extends Env {
  Variables: {
    readonly nonce: string;
    readonly page_title: string;
    readonly config: App_Config;
  };
}
export interface AppEnv_Context extends Env {
  Bindings: {
    ASSETS_PATH: typeof ASSETS_PATH;
    PUBLIC_ASSETS_PATH: typeof PUBLIC_ASSETS_PATH;
  } & App_Env;

  Variables: {
    readonly nonce: string;
    readonly config: App_Config;
  };
}
