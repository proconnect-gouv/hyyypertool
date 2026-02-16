//

import { set_userinfo } from "#src/middleware/auth";
import { set_config } from "#src/middleware/config";
import { set_identite_pg } from "#src/middleware/identite-pg";
import { set_nonce } from "#src/middleware/nonce";
import { schema } from "@~/identite-proconnect/database";
import {
  create_adora_pony_user,
  create_unicorn_organization,
} from "@~/identite-proconnect/database/seed/unicorn";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/database/testing";
import { VerificationTypeSchema } from "@~/identite-proconnect/types";
import { beforeAll, beforeEach, expect, setSystemTime, test } from "bun:test";
import { Hono } from "hono";
import app from "./index";

//

beforeAll(migrate);
beforeEach(empty_database);
setSystemTime(new Date("2222-02-22 22:22:22+22"));

//

test("PATCH /organizations/:id/members/:user_id updates user organization membership", async () => {
  const organization_id = await create_unicorn_organization(pg);
  const user_id = await create_adora_pony_user(pg);

  await pg.insert(schema.users_organizations).values({
    organization_id,
    user_id,
    is_external: false,
    verification_type: VerificationTypeSchema.enum.domain_not_verified_yet,
  });

  {
    const result = await pg.query.users_organizations.findMany({
      where: (table, { eq }) => eq(table.organization_id, organization_id),
    });
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "created_at": "1970-01-01 00:00:00+00",
          "has_been_greeted": false,
          "is_external": false,
          "needs_official_contact_email_verification": false,
          "official_contact_email_verification_sent_at": null,
          "official_contact_email_verification_token": null,
          "organization_id": 1,
          "updated_at": "1970-01-01 00:00:00+00",
          "user_id": 1,
          "verification_type": "domain_not_verified_yet",
          "verified_at": null,
        },
      ]
    `);
  }

  const response = await new Hono()
    .use(set_config({}))
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: "test@example.com" }))
    .route("/:id/members/:user_id", app)
    .request(`/${organization_id}/members/${user_id}`, {
      method: "PATCH",
      body: new URLSearchParams({
        is_external: "true",
        verification_type: VerificationTypeSchema.enum.domain,
      }),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

  expect(response.status).toBe(200);
  expect(response.headers.get("HX-Trigger")).toBe("MEMBERS_UPDATED");

  {
    const result = await pg.query.users_organizations.findMany({
      where: (table, { eq }) => eq(table.organization_id, organization_id),
    });
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "created_at": "1970-01-01 00:00:00+00",
          "has_been_greeted": false,
          "is_external": true,
          "needs_official_contact_email_verification": false,
          "official_contact_email_verification_sent_at": null,
          "official_contact_email_verification_token": null,
          "organization_id": 1,
          "updated_at": "2222-02-22 00:22:22+00",
          "user_id": 1,
          "verification_type": "domain",
          "verified_at": "2222-02-22 00:22:22+00",
        },
      ]
    `);
  }
});

test("PATCH /organizations/:id/members/:user_id clears verification with domain_not_verified_yet", async () => {
  const organization_id = await create_unicorn_organization(pg);
  const user_id = await create_adora_pony_user(pg);

  await pg.insert(schema.users_organizations).values({
    organization_id,
    user_id,
    is_external: false,
    verification_type: "domain",
    verified_at: new Date("1111-11-11 11:11:11+11").toISOString(),
  });

  {
    const result = await pg.query.users_organizations.findMany({
      where: (table, { eq }) => eq(table.organization_id, organization_id),
    });
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "created_at": "1970-01-01 00:00:00+00",
          "has_been_greeted": false,
          "is_external": false,
          "needs_official_contact_email_verification": false,
          "official_contact_email_verification_sent_at": null,
          "official_contact_email_verification_token": null,
          "organization_id": 1,
          "updated_at": "1970-01-01 00:00:00+00",
          "user_id": 1,
          "verification_type": "domain",
          "verified_at": "1111-11-11 00:11:11+00",
        },
      ]
    `);
  }

  const response = await new Hono()
    .use(set_config({}))
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: "test@example.com" }))
    .route("/:id/members/:user_id", app)
    .request(`/${organization_id}/members/${user_id}`, {
      method: "PATCH",
      body: new URLSearchParams({
        verification_type: VerificationTypeSchema.enum.domain_not_verified_yet,
      }),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

  expect(response.status).toBe(200);
  expect(response.headers.get("HX-Trigger")).toBe("MEMBERS_UPDATED");

  {
    const result = await pg.query.users_organizations.findMany({
      where: (table, { eq }) => eq(table.organization_id, organization_id),
    });
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "created_at": "1970-01-01 00:00:00+00",
          "has_been_greeted": false,
          "is_external": false,
          "needs_official_contact_email_verification": false,
          "official_contact_email_verification_sent_at": null,
          "official_contact_email_verification_token": null,
          "organization_id": 1,
          "updated_at": "2222-02-22 00:22:22+00",
          "user_id": 1,
          "verification_type": "domain_not_verified_yet",
          "verified_at": null,
        },
      ]
    `);
  }
});

test("DELETE /organizations/:id/members/:user_id removes user from organization", async () => {
  const organization_id = await create_unicorn_organization(pg);
  const user_id = await create_adora_pony_user(pg);

  await pg.insert(schema.users_organizations).values({
    organization_id,
    user_id,
    is_external: true,
    verification_type: VerificationTypeSchema.enum.domain_not_verified_yet,
  });

  {
    const result = await pg.query.users_organizations.findMany({
      where: (table, { eq }) => eq(table.organization_id, organization_id),
    });
    expect(result).toHaveLength(1);
  }

  const response = await new Hono()
    .use(set_config({}))
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: "test@example.com" }))
    .route("/:id/members/:user_id", app)
    .request(`/${organization_id}/members/${user_id}`, {
      method: "DELETE",
    });

  expect(response.status).toBe(200);
  expect(response.headers.get("HX-Trigger")).toBe("MEMBERS_UPDATED");

  {
    const result = await pg.query.users_organizations.findMany({
      where: (table, { eq }) => eq(table.organization_id, organization_id),
    });
    expect(result).toHaveLength(0);
  }
});
