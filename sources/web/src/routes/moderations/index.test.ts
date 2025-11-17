//

import { set_userinfo } from "#src/middleware/auth";
import { set_config } from "#src/middleware/config";
import { set_identite_pg } from "#src/middleware/identite-pg";
import { set_nonce } from "#src/middleware/nonce";
import {
  create_adora_pony_moderation,
  create_adora_pony_user,
  create_unicorn_organization,
} from "@~/identite-proconnect/database/seed/unicorn";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/database/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { Hono } from "hono";
import app from "./index";

//

beforeAll(migrate);
beforeEach(empty_database);

test("GET /moderations returns moderations list page", async () => {
  await create_unicorn_organization(pg);
  await create_adora_pony_user(pg);
  const moderation_id = await create_adora_pony_moderation(pg, { type: "💼" });

  const response = await new Hono()
    .use(set_config({ ALLOWED_USERS: "test@example.com" }))
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: "test@example.com" }))
    .route("/", app)
    .request("/");

  expect(response.status).toBe(200);
  const html = await response.text();
  expect(html).toContain("Liste des moderations");
  expect(html).toContain("adora.pony@unicorn.xyz");
  expect(html).toContain("Modération ⁉️ 💼 de Adora Pony pour 🦄 siret");
  expect(html).toContain(`/moderations/${moderation_id}`);
});
