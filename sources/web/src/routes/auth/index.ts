//

import env from "#src/config";
import { AuthError } from "#src/errors";
import type { AgentConnectUserInfo } from "#src/middleware/auth";
import type { App_Context } from "#src/middleware/context";
import { urls } from "#src/urls";
import { zValidator } from "@hono/zod-validator";
import { MfaAcrValue_Schema } from "@~/core/schema";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import {
  authorizationCodeGrant,
  buildAuthorizationUrl,
  buildEndSessionUrl,
  fetchUserInfo,
  randomNonce,
  randomState,
} from "openid-client";
import { z } from "zod";
import { agentconnect, type Oidc_Context } from "./agentconnect";

//

export default new Hono<Oidc_Context & App_Context>()
  .onError((error, c) => {
    try {
      const session = c.get("session");
      session.deleteSession();
    } catch {
      // do not break with missing session
    }

    if (error instanceof HTTPException && error.status === 403) {
      throw error;
    }

    throw new AuthError("AgentConnect OIDC Error", { cause: error });
  })

  //

  .use("*", agentconnect())
  .post("/login", async function POST(c) {
    const session = c.get("session");
    const { req, redirect, get } = c;

    const config = get("oidc_config");
    const state = randomState();
    const nonce = randomNonce();

    const redirect_uri = get_redirect_uri(req.url);

    session.set("state", state);
    session.set("nonce", nonce);

    const redirectUrl = buildAuthorizationUrl(config, {
      claims: JSON.stringify({
        id_token: {
          acr: {
            essential: true,
            values: [
              "eidas2",
              "eidas3",
              "https://proconnect.gouv.fr/assurance/self-asserted-2fa",
              "https://proconnect.gouv.fr/assurance/consistency-checked-2fa",
            ],
          },
        },
      }),
      nonce,
      redirect_uri,
      scope: env.AGENTCONNECT_OIDC_SCOPE,
      state,
    });

    return redirect(redirectUrl);
  })
  .get(`/fake/login/callback`, ({ notFound, redirect, var: { session } }) => {
    if (env.NODE_ENV !== "development") return notFound();

    session.set("userinfo", {
      sub: "f52c691e7cc33e3116172d1115eee5e6016f0036095e9a514c86d741f364e88f",
      uid: "1",
      given_name: "Jean",
      usual_name: "User",
      email: "user@yopmail.com",
      siret: "21440109300015",
      phone_number: "0123456789",
      idp_id: "71144ab3-ee1a-4401-b7b3-79b44f7daeeb",
      idp_acr: "eidas1",
      aud: "6925fb8143c76eded44d32b40c0cb1006065f7f003de52712b78985704f39950",
      exp: 1707821864,
      iat: 1707821804,
      iss: "https://fca.integ01.dev-agentconnect.fr/api/v2",
    });
    session.set("idtoken", "");

    return redirect(urls.moderations.$url().pathname);
  })
  .get(
    `/login/callback`,
    zValidator(
      "query",
      z.object({
        code: z.string().trim(),
        iss: z.string(),
        state: z.string(),
      }),
    ),
    async function oidc_callback(c) {
      const session = c.get("session");
      const { redirect, req, get } = c;

      const query = req.valid("query");
      const config = get("oidc_config");

      const redirect_uri = new URL(get_redirect_uri(req.url));
      redirect_uri.search = new URLSearchParams(query).toString();

      const tokens = await authorizationCodeGrant(config, redirect_uri, {
        expectedNonce: session.get("nonce"),
        expectedState: session.get("state"),
      });

      const claims = tokens.claims();

      const result = MfaAcrValue_Schema.safeParse(claims?.["acr"]);

      if (!result.success) {
        throw new HTTPException(403, {
          message:
            "Vous ne pouvez pas accéder au service sans avoir une double authentification installée. Veuillez installer une application d'authentification et vous connecter à nouveau.",
        });
      }

      const userinfo = await fetchUserInfo(
        config,
        tokens.access_token ?? "",
        claims?.sub ?? "",
      );

      session.set("userinfo", userinfo as AgentConnectUserInfo);
      session.set("idtoken", tokens.id_token ?? "");

      return redirect(urls.moderations.$url().pathname);
    },
  )
  .get("/logout", ({ redirect, req, set, var: { oidc_config, session } }) => {
    const id_token_hint = session.get("idtoken");

    const post_logout_redirect_uri = get_logout_redirect_uri(req.url);

    const logoutUrl = buildEndSessionUrl(oidc_config, {
      id_token_hint,
      post_logout_redirect_uri,
    });

    session.deleteSession();
    set("userinfo", undefined as any);

    return redirect(logoutUrl);
  });

//

function get_redirect_uri(url: string) {
  const _url = new URL(url);
  const redirect_uri = `${env.HOST ? env.HOST : _url.origin}${urls.auth.login.callback.$url().pathname}`;
  return redirect_uri;
}

function get_logout_redirect_uri(url: string) {
  const _url = new URL(url);
  const redirect_uri = `${env.HOST ? env.HOST : _url.origin}`;
  return redirect_uri;
}
