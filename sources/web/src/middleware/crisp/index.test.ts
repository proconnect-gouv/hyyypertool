//

import { set_config } from "#src/middleware/config";
import { expect, test } from "bun:test";
import { Hono } from "hono";
import { set_crisp_config } from "./index";

//

test("returns anais_tailhade", async () => {
  const CRISP_BASE_URL = "CRISP_BASE_URL";
  const CRISP_IDENTIFIER = "CRISP_IDENTIFIER";
  const CRISP_KEY = "CRISP_KEY";
  const CRISP_PLUGIN_URN = "CRISP_PLUGIN_URN";
  const CRISP_USER_NICKNAME = "CRISP_USER_NICKNAME";
  const CRISP_WEBSITE_ID = "CRISP_WEBSITE_ID";

  const app = new Hono().get(
    "/",
    set_config({
      CRISP_BASE_URL,
      CRISP_IDENTIFIER,
      CRISP_KEY,
      CRISP_PLUGIN_URN,
      CRISP_USER_NICKNAME,
      CRISP_WEBSITE_ID,
    }),
    set_crisp_config(),
    async ({ json, var: { crisp_config } }) => {
      return json(crisp_config);
    },
  );

  const res = await app.request("/");
  expect(res.status).toBe(200);
  expect(await res.json()).toEqual({
    base_url: CRISP_BASE_URL,
    identifier: CRISP_IDENTIFIER,
    key: CRISP_KEY,
    plugin_urn: CRISP_PLUGIN_URN,
    user_nickname: CRISP_USER_NICKNAME,
    website_id: CRISP_WEBSITE_ID,
    debug: true,
  });
});
