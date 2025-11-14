//

import { set_config } from "#src/middleware/config";
import { set_identite_pg } from "#src/middleware/identite-pg";
import { set_nonce } from "#src/middleware/nonce";

import { set_userinfo } from "#src/middleware/auth";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { Hono } from "hono";
import app from "./index";

//

beforeAll(migrate);
beforeEach(empty_database);

//

test("GET /organizations/domains", async () => {
  const response = await new Hono()
    .use(set_config({}))
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({}))
    .route("/", app)
    .request("/");
  expect(response.status).toBe(200);
});
