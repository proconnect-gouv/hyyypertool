//

import type { AgentConnectUserInfo } from "#src/middleware/auth";
import type { AppContext } from "#src/middleware/context";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { CompactSign, exportJWK, generateKeyPair } from "jose";
import { z } from "zod";

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
                class="flex cursor-pointer flex-col items-start gap-1 rounded-lg border p-4 hover:bg-gray-100"
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
  });
