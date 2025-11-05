//

import { set_userinfo } from "#src/middleware/auth";
import { set_config } from "#src/middleware/config";
import {
  set_identite_pg,
  set_identite_pg_client,
} from "#src/middleware/identite-pg";
import { set_nonce } from "#src/middleware/nonce";
import { schema } from "@~/identite-proconnect.database";
import {
  create_adora_pony_moderation,
  create_adora_pony_user,
  create_unicorn_organization,
} from "@~/identite-proconnect.database/seed/unicorn";
import {
  client,
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect.database/testing";
import { beforeAll, beforeEach, expect, setSystemTime, test } from "bun:test";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import app from "./validate";

//

beforeAll(migrate);
beforeEach(empty_database);
setSystemTime(new Date("2222-01-01T00:00:00.000Z"));

//

test("PATCH /moderations/:id/validate - validates moderation", async () => {
  await create_unicorn_organization(pg);
  await create_adora_pony_user(pg);
  const moderation_id = await create_adora_pony_moderation(pg, {
    type: "test",
  });

  //

  const response = await new Hono()
    .use(
      set_config({
        ALLOWED_USERS: "admin@example.com",
        ZAMMAD_URL: "http://localhost:6500",
      }),
    )
    .use(set_identite_pg(pg))
    .use(set_identite_pg_client(client as any))
    .use(set_nonce("nonce"))
    .use(
      set_userinfo({
        email: "admin@example.com",
        given_name: "Admin",
        usual_name: "User",
      }),
    )
    .route("/:id/validate", app)
    .onError((error) => {
      throw error;
    })
    .request(`/${moderation_id}/validate`, {
      method: "PATCH",
      body: new URLSearchParams({
        add_domain: "false",
        add_member: "AS_EXTERNAL",
        send_notification: "false",
      }),
    });

  // Verify response
  expect(response.status).toBe(200);

  // Verify database state - moderation marked as validated
  const updated_moderation = await pg.query.moderations.findFirst({
    where: eq(schema.moderations.id, moderation_id),
  });

  expect(updated_moderation).toMatchInlineSnapshot(`
    {
      "comment": "7952342400000 admin@example.com | Validé par admin@example.com | Raison : "[ProConnect] ✨ Modeation validée"",
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
