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
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import app from "./reprocess";

//

beforeAll(migrate);
beforeEach(empty_database);
setSystemTime(new Date("2222-01-01T00:00:00.000Z"));

//

test("PATCH /moderations/:id/reprocess - reprocesses approved moderation", async () => {
  const organization_id = await create_unicorn_organization(pg);
  const user_id = await create_adora_pony_user(pg);

  // Create a moderation that was previously approved
  const moderation_id = await create_adora_pony_moderation(pg, {
    type: "test",
  });

  // Mark it as approved (simulate it being processed)
  await pg
    .update(schema.moderations)
    .set({
      moderated_by: "Previous Admin <previous@example.com>",
      moderated_at: new Date("2222-01-01T00:00:00.000Z").toISOString(),
      comment: "7952342400000 admin@example.com | Previously approved",
    })
    .where(eq(schema.moderations.id, moderation_id));

  // Add user to organization (simulate successful approval)
  await pg.insert(schema.users_organizations).values({
    user_id,
    organization_id,
    verification_type: "official_contact_domain",
  });

  //

  const response = await new Hono()
    .use(
      set_config({
        ALLOWED_USERS: "admin@example.com",
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
    .route("/:id/reprocess", app)
    .onError((error) => {
      throw error;
    })
    .request(`/${moderation_id}/reprocess`, {
      method: "PATCH",
    });

  // Verify response
  expect(response.status).toBe(200);

  // Verify database state - moderation reset to pending
  const updated_moderation = await pg.query.moderations.findFirst({
    where: eq(schema.moderations.id, moderation_id),
  });

  expect(updated_moderation).toMatchInlineSnapshot(`
    {
      "comment": 
    "7952342400000 admin@example.com | Previously approved
    7952342400000 admin@example.com | Réouverte par admin@example.com"
    ,
      "created_at": "2222-01-01 00:00:00+00",
      "id": 1,
      "moderated_at": null,
      "moderated_by": null,
      "organization_id": 1,
      "ticket_id": null,
      "type": "test",
      "user_id": 1,
    }
  `);

  // Verify user removed from organization
  const user_org = await pg.query.users_organizations.findFirst({
    where: and(
      eq(schema.users_organizations.user_id, user_id),
      eq(schema.users_organizations.organization_id, organization_id),
    ),
  });

  expect(user_org).toBeUndefined();
});
