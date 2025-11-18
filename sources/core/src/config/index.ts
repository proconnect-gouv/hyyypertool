//

import type { Env } from "hono";
import type { AppEnv } from "./env";
import env from "./env";

//

const ASSETS_PATH = `/assets/${env.VERSION}` as const;
const PUBLIC_ASSETS_PATH = `/assets/${env.VERSION}/public/built` as const;

export default { ...env, ASSETS_PATH, PUBLIC_ASSETS_PATH };

export interface App_Config extends AppEnv {
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
  } & AppEnv;

  Variables: {
    readonly nonce: string;
    readonly config: App_Config;
  };
}
