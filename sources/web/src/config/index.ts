//

import type { Env } from "hono";
import type { AppEnv } from "./env";
import { app_env } from "./env";

//

export { app_env, type AppEnv };

//

export interface AppVariablesContext extends Env {
  Bindings: AppEnv;
  Variables: {
    readonly nonce: string;
    readonly page_title: string;
  };
}

export interface AppEnvContext extends Env {
  Bindings: AppEnv;
  Variables: {
    readonly nonce: string;
  };
}
