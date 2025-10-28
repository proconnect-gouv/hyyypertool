//

import env from "#src/config";
import type { Env, MiddlewareHandler } from "hono";
import {
  allowInsecureRequests,
  ClientSecretPost,
  discovery,
  type Configuration,
} from "openid-client";

//
export function agentconnect(): MiddlewareHandler<Oidc_Context> {
  return async function agentconnect_middleware({ set }, next) {
    const config = await discovery(
      new URL(env.AGENTCONNECT_OIDC_ISSUER),
      env.AGENTCONNECT_OIDC_CLIENT_ID,
      {
        id_token_signed_response_alg: "ES256",
        userinfo_signed_response_alg: "ES256",
      },
      ClientSecretPost(env.AGENTCONNECT_OIDC_SECRET_ID),
      env.NODE_ENV === "development"
        ? { execute: [allowInsecureRequests] }
        : undefined,
    );

    //

    set("oidc_config", config);

    return next();
  };
}

//

export interface Oidc_Context extends Env {
  Variables: {
    oidc_config: Configuration;
  };
}
