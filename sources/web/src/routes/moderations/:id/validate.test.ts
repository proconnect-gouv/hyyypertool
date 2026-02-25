//

import type { validate_form_schema } from "#src/lib/moderations";
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
import {
  beforeAll,
  beforeEach,
  expect,
  setSystemTime,
  spyOn,
  test,
} from "bun:test";
import { and, eq } from "drizzle-orm";
import fc from "fast-check";
import { Hono } from "hono";
import assert from "node:assert/strict";
import type z from "zod";
import app from "./validate";

//

type ValidateFormSchemaType = z.input<typeof validate_form_schema>;

//

beforeAll(migrate);
beforeEach(empty_database);

const fetchSpy = spyOn(globalThis, "fetch").mockImplementation((() =>
  Promise.resolve(Response.json({ ok: true }))) as unknown as typeof fetch);

//

const cases = fc.sample(
  fc.tuple(
    fc.constantFrom("true", "false"),
    fc.constantFrom("AS_INTERNAL", "AS_EXTERNAL"),
    fc.constantFrom("true", "false"),
  ),
  { numRuns: 8 },
);

test.each(cases)(
  "PATCH /moderations/:id/validate marks moderation as validated (add_domain=%s, add_member=%s, send_notification=%s)",
  async (add_domain, add_member, send_notification) => {
    fetchSpy.mockClear();
    setSystemTime(new Date("2222-11-10T00:00:00.000Z"));
    await create_unicorn_organization(pg);
    await create_adora_pony_user(pg);
    const moderation_id = await create_adora_pony_moderation(pg, {
      type: "💼",
    });

    const body = new URLSearchParams({
      add_domain,
      add_member,
      send_notification,
    } as ValidateFormSchemaType);

    setSystemTime(new Date("2222-11-11T00:00:00.000Z"));
    const response = await new Hono()
      .use(
        set_config({
          ALLOWED_USERS: "admin@example.com",
          API_AUTH_URL: "http://crisp.localhost",
          API_AUTH_USERNAME: "API_AUTH_USERNAME",
          API_AUTH_PASSWORD: "API_AUTH_PASSWORD",
        }),
      )
      .use(set_identite_pg(pg))
      .use(set_identite_pg_client(client as any))
      .use(set_userinfo({ email: "admin@example.com" }))
      .route("/:id/validate", app)
      .request(`/${moderation_id}/validate`, {
        method: "PATCH",
        body,
      });

    expect(response.status).toBe(200);

    const moderation = await pg.query.moderations.findFirst({
      where: (table, { eq }) => eq(table.id, moderation_id),
    });

    expect(moderation).toEqual({
      comment: `7979472000000 admin@example.com | Validé par admin@example.com | Raison : "[ProConnect] ✨ Modération validée"`,
      created_at: "2222-11-10 00:00:00+00",
      id: 1,
      moderated_at: "2222-11-11 00:00:00+00",
      moderated_by: " <admin@example.com>",
      organization_id: 1,
      status: "accepted",
      ticket_id: null,
      type: "💼",
      user_id: 1,
    });

    assert.ok(moderation);
    const link = await pg.query.users_organizations.findFirst({
      where: and(eq(schema.users_organizations.user_id, moderation.user_id)),
    });

    expect(link).toEqual({
      created_at: "2222-11-11 00:00:00+00",
      has_been_greeted: false,
      is_external: add_member === "AS_EXTERNAL",
      needs_official_contact_email_verification: false,
      official_contact_email_verification_sent_at: null,
      official_contact_email_verification_token: null,
      organization_id: 1,
      updated_at: "2222-11-11 00:00:00+00",
      user_id: 1,
      verification_type: "domain",
      verified_at: "2222-11-11 00:00:00+00",
    });

    if (send_notification === "true") {
      expect(fetchSpy).toHaveBeenCalled();
    }
  },
);

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
