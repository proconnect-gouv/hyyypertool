//

import { set_userinfo } from "#src/middleware/auth";
import { set_config } from "#src/middleware/config";
import { set_identite_pg } from "#src/middleware/identite-pg";
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

//

test("PATCH /moderations/:id/processed marks moderation as rejected with DUPLICATE", async () => {
  await create_unicorn_organization(pg);
  await create_adora_pony_user(pg);
  const moderation_id = await create_adora_pony_moderation(pg, {
    type: "💼",
  });

  const response = await new Hono()
    .use(set_config({ ALLOWED_USERS: "admin@example.com" }))
    .use(set_identite_pg(pg))
    .use(set_userinfo({ email: "admin@example.com" }))
    .route("/:id/processed", app)
    .request(`/${moderation_id}/processed`, { method: "PATCH" });

  expect(response.status).toBe(200);

  const moderation = await pg.query.moderations.findFirst({
    where: (table, { eq }) => eq(table.id, moderation_id),
  });

  expect(moderation?.moderated_at).not.toBeNull();
  expect(moderation?.comment).toContain("DUPLICATE");
});
