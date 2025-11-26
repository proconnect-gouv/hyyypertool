//

import { set_config } from "#src/middleware/config";
import { expect, mock, test } from "bun:test";
import { Hono } from "hono";
import { set_crisp_client, set_crisp_client_from_config } from "./index";

//

test("set_crisp_client injects mock client", async () => {
  const mockCrisp = {
    create_conversation: mock(),
    get_user: mock(),
    mark_conversation_as_resolved: mock(),
    send_message: mock(),
  };

  const app = new Hono().get(
    "/",
    set_crisp_client(mockCrisp),
    async ({ json, var: { crisp } }) => {
      return json({ hasClient: crisp === mockCrisp });
    },
  );

  const res = await app.request("/");
  expect(res.status).toBe(200);
  expect(await res.json()).toEqual({ hasClient: true });
});

test("set_crisp_client_from_config creates client from config", async () => {
  const app = new Hono().get(
    "/",
    set_config({
      CRISP_BASE_URL: "https://api.crisp.chat",
      CRISP_IDENTIFIER: "test-identifier",
      CRISP_KEY: "test-key",
      CRISP_PLUGIN_URN: "urn:test",
      CRISP_USER_NICKNAME: "test-user",
      CRISP_WEBSITE_ID: "test-website-id",
    }),
    set_crisp_client_from_config(),
    async ({ json, var: { crisp } }) => {
      return json({
        hasClient: Boolean(crisp),
      });
    },
  );

  const res = await app.request("/");
  expect(res.status).toBe(200);
  expect(await res.json()).toEqual({ hasClient: true });
});
