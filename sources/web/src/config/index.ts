//

import type { Env } from "hono";
import type { AppEnv } from "./env";
import env, { app_env } from "./env";

const ASSETS_PATH = `/assets/${env.VERSION}` as const;
const PUBLIC_ASSETS_PATH = `/assets/${env.VERSION}/public/built` as const;

export default { ...env, ASSETS_PATH, PUBLIC_ASSETS_PATH };
export { admin_email_list, ADMIN_EMAILS } from "./admin_emails";
export { app_env };

export interface AppConfig extends AppEnv {
  ASSETS_PATH: typeof ASSETS_PATH;
  PUBLIC_ASSETS_PATH: typeof PUBLIC_ASSETS_PATH;
}

//

export interface AppVariablesContext extends Env {
  Variables: {
    readonly nonce: string;
    readonly page_title: string;
    readonly config: AppConfig;
  };
}

export interface AppEnvContext extends Env {
  Bindings: {
    ASSETS_PATH: typeof ASSETS_PATH;
    PUBLIC_ASSETS_PATH: typeof PUBLIC_ASSETS_PATH;
  } & AppEnv;

  Variables: {
    readonly nonce: string;
    readonly config: AppConfig;
  };
}
