//

import { set_config } from "#src/middleware/config";
import {
  set_identite_pg,
  set_identite_pg_client,
} from "#src/middleware/identite-pg";
import { set_userinfo } from "#src/middleware/auth";
import {
  create_adora_pony_moderation,
  create_adora_pony_user,
  create_unicorn_organization,
} from "@~/identite-proconnect/database/seed/unicorn";
import {
  client,
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { Hono } from "hono";
import app from "./validate";

//

beforeAll(migrate);
beforeEach(empty_database);

//

test("PATCH /moderations/:id/validate marks moderation as validated", async () => {
  await create_unicorn_organization(pg);
  await create_adora_pony_user(pg);
  const moderation_id = await create_adora_pony_moderation(pg, {
    type: "💼",
  });

  const response = await new Hono()
    .use(set_config({ ALLOWED_USERS: "admin@example.com" }))
    .use(set_identite_pg(pg))
    .use(set_identite_pg_client(client))
    .use(set_userinfo({ email: "admin@example.com" }))
    .route("/:id/validate", app)
    .request(`/${moderation_id}/validate`, {
      method: "PATCH",
      body: new URLSearchParams({
        add_domain: "false",
        add_member: "AS_INTERNAL",
        send_notification: "false",
      }),
    });

  expect(response.status).toBe(200);

  const moderation = await pg.query.moderations.findFirst({
    where: (table, { eq }) => eq(table.id, moderation_id),
  });

  expect(moderation?.moderated_at).not.toBeNull();
  expect(moderation?.comment).toContain("Validé");
});
