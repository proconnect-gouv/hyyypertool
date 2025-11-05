//

import { set_userinfo } from "#src/middleware/auth";
import { set_config } from "#src/middleware/config";
import { set_identite_pg } from "#src/middleware/identite-pg";
import { set_nonce } from "#src/middleware/nonce";
import { schema } from "@~/identite-proconnect.database";
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
import { beforeAll, beforeEach, expect, setSystemTime, test } from "bun:test";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import app from "./processed";

//

beforeAll(migrate);
beforeEach(empty_database);
setSystemTime(new Date("2222-01-01T00:00:00.000Z"));

//

test("PATCH /moderations/:id/processed - marks moderation as rejected (duplicate)", async () => {
  await create_unicorn_organization(pg);
  await create_adora_pony_user(pg);
  const moderation_id = await create_adora_pony_moderation(pg, {
    type: "test",
    ticket_id: null,
  });

  //

  const response = await new Hono()
    .use(
      set_config({
        ALLOWED_USERS: "admin@example.com",
        CRISP_IDENTIFIER: "test-crisp-id",
        CRISP_KEY: "test-crisp-key",
        CRISP_RESOLVE_DELAY: 0,
        CRISP_WEBSITE_ID: "test-website-id",
      }),
    )
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(
      set_userinfo({
        email: "admin@example.com",
        given_name: "Admin",
        usual_name: "User",
      }),
    )
    .route("/:id/processed", app)
    .onError((error) => {
      throw error;
    })
    .request(`/${moderation_id}/processed`, {
      method: "PATCH",
    });

  // Verify response
  expect(response.status).toBe(200);
  expect(response.headers.get("HX-Trigger")).toBe(
    "MODERATION_EMAIL_UPDATED, MODERATION_UPDATED",
  );

  // Verify database state - moderation marked as rejected (duplicate)
  const updated_moderation = await pg.query.moderations.findFirst({
    where: eq(schema.moderations.id, moderation_id),
  });

  expect(updated_moderation).toMatchInlineSnapshot(`
    {
      "comment": "7952342400000 admin@example.com | Rejeté par admin@example.com | Raison : \"DUPLICATE\"",
      "created_at": "2222-01-01 00:00:00+00",
      "id": 1,
      "moderated_at": "2222-01-01 00:00:00+00",
      "moderated_by": "Admin User <admin@example.com>",
      "organization_id": 1,
      "ticket_id": null,
      "type": "test",
      "user_id": 1,
    }
  `);
});
