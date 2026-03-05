//

import type { AppEnvContext } from "#src/config";
import type { Env, MiddlewareHandler } from "hono";
import {
  allowInsecureRequests,
  ClientSecretPost,
  discovery,
  type Configuration,
} from "openid-client";

//
export function agentconnect(): MiddlewareHandler<
  Oidc_Context & AppEnvContext
> {
  return async function agentconnect_middleware(c, next) {
    const config = await discovery(
      new URL(c.env.AGENTCONNECT_OIDC_ISSUER),
      c.env.AGENTCONNECT_OIDC_CLIENT_ID,
      {
        id_token_signed_response_alg: "ES256",
        userinfo_signed_response_alg: "ES256",
      },
      ClientSecretPost(c.env.AGENTCONNECT_OIDC_SECRET_ID),
      c.env.NODE_ENV === "development"
        ? { execute: [allowInsecureRequests] }
        : undefined,
    );

    //

    c.set("oidc_config", config);

    return next();
  };
}

//

export interface Oidc_Context extends Env {
  Variables: {
    oidc_config: Configuration;
  };
}
