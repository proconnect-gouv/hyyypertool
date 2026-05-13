//

import type { AgentConnectUserInfo } from "#src/middleware/auth";
import type { AppContext } from "#src/middleware/context";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { CompactSign, exportJWK, generateKeyPair } from "jose";
import { z } from "zod";

//

function LogoutPage({ redirect_url }: { redirect_url: string }) {
  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="refresh" content="2; url=${redirect_url}" />
    <title>Déconnexion</title>
    <style>
      body {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100dvh;
        margin: 0;
        font-family: system-ui, sans-serif;
        background: #f6f6f6;
        color: #3a3a3a;
      }
      p { font-size: 1.125rem; }
    </style>
  </head>
  <body>
    <p>Déconnexion en cours...</p>
    <script>setTimeout(() => location.replace(${JSON.stringify(redirect_url)}), 1111)</script>
  </body>
</html>`;
}

//

const profiles = [
  {
    email: "admin@omega.gouv.fr",
    sub: "oidc-sub-admin",
    role: "admin",
    given_name: "Admin",
    usual_name: "Omega",
  },
  {
    email: "moderateur@beta.gouv.fr",
    sub: "oidc-sub-moderateur",
    role: "moderator",
    given_name: "Modérateur",
    usual_name: "Beta",
  },
  {
    email: "jeanbon@yopmail.com",
    sub: "oidc-sub-jeanbon",
    role: "visitor",
    given_name: "Jean",
    usual_name: "Bon",
  },
  {
    email: "unknown@example.com",
    sub: "oidc-sub-unknown",
    role: "none",
    given_name: "Inconnu",
    usual_name: "Exemple",
  },
] as const;

//

const CODE_MAP = new Map<
  string,
  { client_id: string; nonce: string; state: string; redirect_uri: string }
>();

let selected_userinfo: AgentConnectUserInfo | undefined;

const keys = await generateKeyPair("ES256");

async function sign_jwt(payload: Record<string, unknown>) {
  return new CompactSign(Buffer.from(JSON.stringify(payload)))
    .setProtectedHeader({ alg: "ES256", typ: "JWT" })
    .sign(keys.privateKey);
}

//

export default new Hono<AppContext>()
  .get("/.well-known/openid-configuration", (c) => {
    const issuer = c.env.AGENTCONNECT_OIDC_ISSUER;
    return c.json({
      issuer,
      authorization_endpoint: `${issuer}/authorize`,
      token_endpoint: `${issuer}/token`,
      userinfo_endpoint: `${issuer}/userinfo`,
      jwks_uri: `${issuer}/jwks`,
      end_session_endpoint: `${issuer}/session/end`,
      response_types_supported: ["code"],
      subject_types_supported: ["pairwise"],
      id_token_signing_alg_values_supported: ["ES256"],
      scopes_supported: [
        "openid",
        "given_name",
        "usual_name",
        "email",
        "phone",
        "organizational_unit",
        "siren",
        "siret",
        "belonging_population",
        "idp_id",
        "idp_acr",
        "is_service_public",
      ],
      claims_supported: [
        "sub",
        "given_name",
        "usual_name",
        "email",
        "phone_number",
        "siret",
        "siren",
        "organizational_unit",
        "belonging_population",
        "idp_id",
        "idp_acr",
        "is_service_public",
        "acr",
        "amr",
        "iss",
        "auth_time",
        "sid",
      ],
      acr_values_supported: ["eidas1"],
      code_challenge_methods_supported: ["S256"],
      grant_types_supported: ["authorization_code"],
      token_endpoint_auth_methods_supported: [
        "client_secret_post",
        "private_key_jwt",
      ],
    });
  })
  .get("/jwks", async (c) => {
    const jwk = await exportJWK(keys.publicKey);
    return c.json({ keys: [{ ...jwk, alg: "ES256", use: "sig" }] });
  })
  .get(
    "/authorize",
    zValidator(
      "query",
      z.object({
        client_id: z.string(),
        nonce: z.string(),
        redirect_uri: z.string(),
        state: z.string(),
      }),
    ),
    (c) => {
      const { client_id, redirect_uri, state, nonce } = c.req.valid("query");
      const code = `_${Date.now()}`;
      CODE_MAP.set(code, { client_id, nonce, redirect_uri, state });

      const basePath = new URL(c.req.url).pathname
        .split("/")
        .slice(0, -1)
        .join("/");

      return c.redirect(`${basePath}/interaction/${code}/login`);
    },
  )
  .get("/interaction/:code/login", (c) => {
    const { code } = c.req.param();
    const codeObj = CODE_MAP.get(code);
    if (!codeObj) return c.notFound();

    return c.render(
      <main class="flex h-full grow flex-col items-center justify-center gap-8 p-8">
        <h1 class="text-2xl font-bold">Pick a testing profile</h1>
        <div class="flex flex-wrap gap-4">
          {profiles.map((profile) => (
            <form method="post">
              <input type="hidden" name="email" value={profile.email} />
              <button
                type="submit"
                class="dark:hover:bg-grey-850 flex cursor-pointer flex-col items-start gap-1 rounded-lg border p-4 hover:bg-gray-100"
              >
                <span class="font-semibold">
                  {profile.given_name} {profile.usual_name}
                </span>
                <span class="text-sm text-gray-600">{profile.email}</span>
                <span class="text-xs font-medium text-blue-600 uppercase">
                  {profile.role}
                </span>
              </button>
            </form>
          ))}
        </div>
      </main>,
    );
  })
  .post("/interaction/:code/login", async (c) => {
    const { code } = c.req.param();
    const codeObj = CODE_MAP.get(code);
    if (!codeObj) return c.notFound();

    const body = await c.req.parseBody();
    const email = body["email"];
    const profile = profiles.find((p) => p.email === email);
    if (!profile) return c.notFound();

    selected_userinfo = {
      sub: profile.sub,
      given_name: profile.given_name,
      usual_name: profile.usual_name,
      email: profile.email,
      siret: "00000000000000",
      phone_number: "0000000000",
    };

    const { redirect_uri, state } = codeObj;
    const params = new URLSearchParams({
      code,
      iss: c.env.AGENTCONNECT_OIDC_ISSUER,
      state,
    });

    return c.redirect(`${redirect_uri}?${params}`);
  })
  .post("/token", async (c) => {
    const body = await c.req.parseBody();
    const code = String(body["code"]);

    const codeObj = CODE_MAP.get(code);
    if (!codeObj) return c.json({ error: "invalid_grant" }, 400);
    CODE_MAP.delete(code);

    const { client_id, nonce } = codeObj;

    const id_token = await sign_jwt({
      iss: c.env.AGENTCONNECT_OIDC_ISSUER,
      aud: client_id,
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000),
      nonce,
      sub: selected_userinfo?.sub ?? "unknown",
      acr: "https://proconnect.gouv.fr/assurance/self-asserted-2fa",
    });

    return c.json({
      access_token: "==MOCK_AC_ACCESS_TOKEN==",
      token_type: "bearer",
      expires_in: 3600,
      id_token,
    });
  })
  .get("/userinfo", async (c: any) => {
    if (!selected_userinfo) return c.json({ error: "no_user_selected" }, 400);

    const jwt = await sign_jwt({
      ...selected_userinfo,
      iss: c.env.AGENTCONNECT_OIDC_ISSUER,
      aud: c.env.AGENTCONNECT_OIDC_CLIENT_ID,
    });

    return new Response(jwt, {
      headers: { "content-type": "application/jwt" },
    });
  })
  .get(
    "/session/end",
    zValidator(
      "query",
      z.object({
        post_logout_redirect_uri: z.url(),
        state: z.string(),
      }),
    ),
    (c) => {
      const { post_logout_redirect_uri, state } = c.req.valid("query");

      const redirect_url = new URL(post_logout_redirect_uri);
      redirect_url.searchParams.set("state", state);

      const html = new TextEncoder().encode(
        LogoutPage({ redirect_url: redirect_url.href }),
      );

      const stream = new ReadableStream({
        async start(controller) {
          controller.enqueue(html);
          await new Promise((resolve) => setTimeout(resolve, 1_111));
          controller.close();
        },
      });

      selected_userinfo = undefined;

      return new Response(stream, {
        headers: {
          "Content-Type": "text/html; charset=UTF-8",
          "Transfer-Encoding": "chunked",
        },
        status: 303,
      });
    },
  );
