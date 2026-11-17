//

import { set_config } from "#src/middleware/config";
import { set_nonce } from "#src/middleware/nonce";
import { expect, test } from "bun:test";
import { Hono } from "hono";
import app from "./index";

//

test("GET / shows today's HyyyperDay when hyyyperdate is impossible", async () => {
  const response = await new Hono()
    .use(set_config({ PUBLIC_ASSETS_PATH: "/assets/v/public/built" }))
    .use(set_nonce("nonce"))
    .route("/", app)
    .request("/?hyyyperdate=2026-02-31");

  expect({
    has_hyyyperday: /data-hyyyperday="/.test(await response.text()),
    status: response.status,
  }).toEqual({ has_hyyyperday: true, status: 200 });
});
