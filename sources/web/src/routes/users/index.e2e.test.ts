//

import { set_userinfo } from "#src/middleware/auth/set_userinfo";
import { set_nonce } from "#src/middleware/nonce";
import { set_config } from "@~/app.middleware/set_config";
import { set_identite_pg } from "@~/app.middleware/set_identite_pg";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect.database/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { Hono } from "hono";
import app from "./index";

//

beforeAll(migrate);
beforeEach(empty_database);

//

test("GET /users", async () => {
  const response = await new Hono()
    .use(set_config({ ALLOWED_USERS: "good@captain.yargs" }))
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: "good@captain.yargs" }))
    .route("/", app)
    .onError((error) => {
      throw error;
    })
    .request("/");

  if (response.status >= 400) throw await response.text();

  expect(response.status).toBe(200);
});
