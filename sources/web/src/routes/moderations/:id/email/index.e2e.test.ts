//

import { set_nonce } from "#src/middleware/nonce";
import { set_config } from "@~/app.middleware/set_config";
import { set_identite_pg } from "@~/app.middleware/set_identite_pg";

import { set_userinfo } from "#src/middleware/auth/set_userinfo";
import {
  create_adora_pony_moderation,
  create_adora_pony_user,
  create_unicorn_organization,
} from "@~/identite-proconnect.database/seed/unicorn";
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

test("GET /moderations/:id/email", async () => {
  await create_unicorn_organization(pg);
  await create_adora_pony_user(pg);

  const moderation_id = await create_adora_pony_moderation(pg, { type: "" });

  //

  const response = await new Hono()
    .use(set_config({ ALLOWED_USERS: "good@captain.yargs" }))
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: "good@captain.yargs" }))
    .route("/:id/email", app)
    .onError((error) => {
      throw error;
    })
    .request(`/${moderation_id}/email?describedby=🐘`);

  if (response.status >= 400) throw await response.text();

  expect(response.status).toBe(200);
});
