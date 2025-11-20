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
import { beforeAll, beforeEach, expect, setSystemTime, test } from "bun:test";
import { Hono } from "hono";
import app from "./index";

//

beforeAll(migrate);
beforeEach(empty_database);
setSystemTime(new Date("2222-01-01T00:00:00.000Z"));

test("GET /users/:id/moderations returns user's moderations", async () => {
  await create_unicorn_organization(pg);
  const user_id = await create_adora_pony_user(pg);
  const moderation_id = await create_adora_pony_moderation(pg, { type: "🦷" });

  const response = await new Hono()
    .use(set_config({}))
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: "test@example.com" }))
    .route("/:id/moderations", app)
    .request(`/${user_id}/moderations?describedby=test`);

  expect(response.status).toBe(200);
  const html = await response.text();
  expect(html).toContain("Type");
  expect(html).toContain("Date de création");
  expect(html).toContain("Modéré le");
  expect(html).toContain("Commentaire");
  // Verify the moderation data is rendered
  expect(html).toContain(moderation_id.toString());
  expect(html).toContain("🦷");
});

test("GET /users/:id/moderations with no moderations", async () => {
  const user_id = await create_adora_pony_user(pg);

  const response = await new Hono()
    .use(set_config({}))
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: "test@example.com" }))
    .route("/:id/moderations", app)
    .request(`/${user_id}/moderations?describedby=test`);

  expect(response.status).toBe(200);
  const html = await response.text();
  // Should still render the table headers even with no moderations
  expect(html).toContain("Type");
  expect(html).toContain("Date de création");
  expect(html).toContain("Modéré le");
  expect(html).toContain("Commentaire");
});

test("GET /users/:id/moderations handles multiple moderations", async () => {
  await create_unicorn_organization(pg);
  const user_id = await create_adora_pony_user(pg);
  const moderation_id_1 = await create_adora_pony_moderation(pg, {
    type: "🦷",
  });
  const moderation_id_2 = await create_adora_pony_moderation(pg, {
    type: "🏢",
  });

  const response = await new Hono()
    .use(set_config({}))
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: "test@example.com" }))
    .route("/:id/moderations", app)
    .request(`/${user_id}/moderations?describedby=test`);

  expect(response.status).toBe(200);
  const html = await response.text();
  expect(html).toContain("Type");
  expect(html).toContain("Date de création");
  // Verify both moderations are rendered
  expect(html).toContain(moderation_id_1.toString());
  expect(html).toContain(moderation_id_2.toString());
  expect(html).toContain("🦷");
  expect(html).toContain("🏢");
});
