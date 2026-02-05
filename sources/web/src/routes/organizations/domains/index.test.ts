//

import { authorized, set_userinfo } from "#src/middleware/auth";
import { set_config } from "#src/middleware/config";
import { set_hyyyper_pg } from "#src/middleware/hyyyperbase";
import { set_identite_pg } from "#src/middleware/identite-pg";
import { set_nonce } from "#src/middleware/nonce";
import { empty_database as hyyyperbase_empty_database, hyyyper_pglite } from "@~/hyyyperbase/testing";
import { insert_moderateur } from "@~/hyyyperbase/testing/users";
import { empty_database as identite_empty_database, migrate, pg } from "@~/identite-proconnect/database/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { Hono } from "hono";
import app from "./index";

//

beforeAll(migrate);
beforeEach(identite_empty_database);
beforeEach(hyyyperbase_empty_database);

//

test("GET /organizations/domains", async () => {
  const moderator = await insert_moderateur(hyyyper_pglite);

  const response = await new Hono()
    .use(set_config({}))
    .use(set_hyyyper_pg(hyyyper_pglite))
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: moderator.email, sub: moderator.sub! }))
    .use(authorized())
    .route("/", app)
    .request("/");
  expect(response.status).toBe(200);
});
