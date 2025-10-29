import { hyyyyyypertool_session } from "#src/middleware/session/hyyypersession.ts";
import { expect, mock, test } from "bun:test";
import { Hono } from "hono";
import app from "./index.ts";

test("GET /login/callback", async () => {
  mock.module("openid-client", () => {
    return {
      allowInsecureRequests: () => {},
      authorizationCodeGrant: () => ({
        claims: () => {},
      }),
      buildAuthorizationUrl: () => {},
      buildEndSessionUrl: () => {},
      ClientSecretPost: () => {},
      discovery: () => Promise.resolve({}),
      fetchUserInfo: () => {},
      randomNonce: () => {},
      randomState: () => {},
    };
  });

  const res = await new Hono()
    .use(hyyyyyypertool_session)
    .route("/", app)
    .request("/login/callback?code=code&iss=iss&state=state");

  expect(res.status).toBe(403);
  expect(await res.text()).toMatchInlineSnapshot(
    `"Vous ne pouvez pas accéder au service sans avoir une double authentification installée. Veuillez installer une application d'authentification et vous connecter à nouveau."`,
  );
});
