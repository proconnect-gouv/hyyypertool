//

import { expect, test } from "bun:test";
import { Hono } from "hono";
import { set_userinfo } from "./set_userinfo";
import { anais_tailhade } from "./set_userinfo.test#fixture";

//

test("returns anais_tailhade", async () => {
  const app = new Hono().get(
    "/",
    set_userinfo(anais_tailhade),
    async ({ json, var: { userinfo } }) => {
      return json(userinfo);
    },
  );

  const res = await app.request("/");
  expect(res.status).toBe(200);
  expect(await res.json()).toEqual(anais_tailhade);
});
