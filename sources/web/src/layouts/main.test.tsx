//

import { authorized, set_userinfo } from "#src/middleware/auth";
import { set_config } from "#src/middleware/config";
import { set_hyyyper_pg } from "#src/middleware/hyyyperbase";
import { set_nonce } from "#src/middleware/nonce";
import { hyyyper_pglite, reset } from "@~/hyyyperbase/testing";
import { insert_admin } from "@~/hyyyperbase/testing/users";
import {
  beforeAll,
  beforeEach,
  expect,
  mock,
  setSystemTime,
  test,
} from "bun:test";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { Main_Layout } from "./main";

//

let uuidCounter = 0;

mock.module("node:crypto", () => ({
  randomUUID: () => {
    return `test-uuid-${++uuidCounter}`;
  },
}));

beforeAll(() => {
  setSystemTime(new Date("2222-01-01T00:00:00.000Z"));
});

beforeEach(() => {
  uuidCounter = 0;
});
beforeEach(reset);

test("Main Layout", async () => {
  const admin = await insert_admin(hyyyper_pglite);
  const app = new Hono()
    .use(
      set_config({
        ASSETS_PATH: "/assets/ASSETS_PATH",
        NODE_ENV: "production",
        PUBLIC_ASSETS_PATH: `/assets/PUBLIC_ASSETS_PATH/public/built`,
        VERSION: "__VERSION__",
      }),
    )
    .use(set_hyyyper_pg(hyyyper_pglite))
    .use(
      set_userinfo({
        given_name: "Lara",
        usual_name: "Croft",
        email: admin.email,
        sub: admin.sub!,
      }),
    )
    .use(set_nonce("nonce"))
    .use(authorized())
    .use(jsxRenderer(Main_Layout))
    .get("/", (c) => {
      return c.render("✅");
    });

  const res = await app.request("/");
  expect(res.status).toBe(200);
  expect(await res.text()).toMatchSnapshot();
});
