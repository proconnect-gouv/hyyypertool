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
import { beforeAll, beforeEach, expect, setSystemTime, test } from "bun:test";
import { Hono } from "hono";
import app from "./index";

//

beforeAll(migrate);
beforeEach(empty_database);

//

test("PATCH /moderations/:id/reprocess resets moderation to pending", async () => {
  setSystemTime(new Date("2222-01-01T00:00:00.000Z"));

  await create_unicorn_organization(pg);
  await create_adora_pony_user(pg);
  const moderation_id = await create_adora_pony_moderation(pg, {
    type: "💼",
    moderated_at: new Date().toISOString(),
    moderated_by: "previous@moderator.com",
  });

  setSystemTime(new Date("2222-01-02T00:00:00.000Z"));
  const response = await new Hono()
    .use(set_config({ ALLOWED_USERS: "admin@example.com" }))
    .use(set_identite_pg(pg))
    .use(set_userinfo({ email: "admin@example.com" }))
    .route("/:id/reprocess", app)
    .request(`/${moderation_id}/reprocess`, { method: "PATCH" });

  expect(response.status).toBe(200);

  const moderation = await pg.query.moderations.findFirst({
    where: (table, { eq }) => eq(table.id, moderation_id),
  });

  expect(moderation).toMatchInlineSnapshot(`
    {
      "comment": "7952428800000 admin@example.com | Réouverte par admin@example.com",
      "created_at": "2222-01-01 00:00:00+00",
      "id": 1,
      "moderated_at": null,
      "moderated_by": null,
      "organization_id": 1,
      "status": "reopened",
      "ticket_id": null,
      "type": "💼",
      "user_id": 1,
    }
  `);
});
