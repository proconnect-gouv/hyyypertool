//

import { set_config } from "#src/middleware/config";
import { set_nonce } from "#src/middleware/nonce";
import { beforeAll, expect, setSystemTime, test } from "bun:test";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { Root_Layout } from "./root";

//

beforeAll(() => {
  setSystemTime(new Date("2222-01-01T00:00:00.000Z"));
});

test("development", async () => {
  const app = new Hono()
    .use(
      set_config({
        ASSETS_PATH: "/assets/ASSETS_PATH",
        NODE_ENV: "development",
        PUBLIC_ASSETS_PATH: `/assets/PUBLIC_ASSETS_PATH/public/built`,
        VERSION: "__VERSION__",
      }),
    )
    .use(set_nonce("nonce"))
    .use(jsxRenderer(Root_Layout))
    .get("/", (c) => {
      return c.render("");
    });

  const res = await app.request("/");
  expect(res.status).toBe(200);
  expect(await res.text()).toMatchSnapshot();
});

test("production", async () => {
  const app = new Hono()
    .use(
      set_config({
        ASSETS_PATH: "/assets/ASSETS_PATH",
        NODE_ENV: "production",
        PUBLIC_ASSETS_PATH: `/assets/PUBLIC_ASSETS_PATH/public/built`,
        VERSION: "__VERSION__",
      }),
    )
    .use(set_nonce("nonce"))
    .use(jsxRenderer(Root_Layout))
    .get("/", (c) => {
      return c.render("");
    });

  const res = await app.request("/");
  expect(res.status).toBe(200);
  expect(await res.text()).toMatchSnapshot();
});
