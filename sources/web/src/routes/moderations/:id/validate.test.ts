//

import { set_userinfo } from "#src/middleware/auth";
import { set_config } from "#src/middleware/config";
import {
  set_identite_pg,
  set_identite_pg_client,
} from "#src/middleware/identite-pg";
import { schema } from "@~/identite-proconnect/database";
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
} from "@~/identite-proconnect/database/testing";
import { VerificationTypeSchema } from "@~/identite-proconnect/types";
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
    .use(set_identite_pg_client(client as any))
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

test("PATCH /moderations/:id/validate succeeds when user is already linked to organization", async () => {
  const organization_id = await create_unicorn_organization(pg);
  const user_id = await create_adora_pony_user(pg);
  const moderation_id = await create_adora_pony_moderation(pg, {
    type: "💼",
  });

  // Pre-link user to organization
  await pg.insert(schema.users_organizations).values({
    organization_id,
    user_id,
    is_external: true,
    verification_type: VerificationTypeSchema.enum.domain_not_verified_yet,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const response = await new Hono()
    .use(set_config({ ALLOWED_USERS: "admin@example.com" }))
    .use(set_identite_pg(pg))
    .use(set_identite_pg_client(client as any))
    .use(set_userinfo({ email: "admin@example.com" }))
    .route("/:id/validate", app)
    .request(`/${moderation_id}/validate`, {
      method: "PATCH",
      body: new URLSearchParams({ add_member: "AS_INTERNAL" }),
    });

  expect(response.status).toBe(200);

  const link = await pg.query.users_organizations.findFirst({
    where: (table, { and, eq }) =>
      and(
        eq(table.organization_id, organization_id),
        eq(table.user_id, user_id),
      ),
  });

  expect(link?.is_external).toBe(false);
});
