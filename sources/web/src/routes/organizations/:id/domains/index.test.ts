//

import { set_userinfo } from "#src/middleware/auth";
import { set_config } from "#src/middleware/config";
import {
  set_identite_pg,
  set_identite_pg_client,
} from "#src/middleware/identite-pg";
import { set_nonce } from "#src/middleware/nonce";
import { schema } from "@~/identite-proconnect/database";
import {
  create_adora_pony_user,
  create_pink_diamond_user,
  create_red_diamond_user,
  create_unicorn_organization,
} from "@~/identite-proconnect/database/seed/unicorn";
import {
  client,
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/database/testing";
import {
  EmailDomainVerificationTypes,
  LinkTypes,
} from "@~/identite-proconnect/types";
import { beforeAll, beforeEach, expect, setSystemTime, test } from "bun:test";
import { Hono } from "hono";
import app from "./index";

//

beforeAll(migrate);
beforeEach(empty_database);
setSystemTime(new Date("2222-01-01T00:00:00.000Z"));

//

test("GET /organizations/:id/domains returns domains for organization", async () => {
  const organization_id = await create_unicorn_organization(pg);

  await pg.insert(schema.email_domains).values({
    domain: "rainbow.xyz",
    organization_id,
    verification_type: EmailDomainVerificationTypes.enum.not_verified_yet,
  });

  const response = await new Hono()
    .use(set_config({}))
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: "test@example.com" }))
    .route("/:id/domains", app)
    .request(`/${organization_id}/domains?describedby=test-id`);

  expect(response.status).toBe(200);

  const html = await response.text();
  expect(html).toContain("unicorn.xyz");
  expect(html).toContain("rainbow.xyz");
});

test("PUT /organizations/:id/domains adds new domain", async () => {
  const organization_id = await create_unicorn_organization(pg);
  const adora_pony_user_id = await create_adora_pony_user(pg);
  const pink_diamond_user_id = await create_pink_diamond_user(pg);
  const red_diamond_user_id = await create_red_diamond_user(pg);

  await pg.insert(schema.users_organizations).values({
    organization_id: organization_id,
    user_id: adora_pony_user_id,
    verification_type: LinkTypes.enum.domain_not_verified_yet,
  });
  await pg.insert(schema.users_organizations).values({
    organization_id: organization_id,
    user_id: pink_diamond_user_id,
    verification_type: LinkTypes.enum.no_validation_means_available,
  });
  await pg.insert(schema.users_organizations).values({
    organization_id: organization_id,
    user_id: red_diamond_user_id,
    verification_type: LinkTypes.enum.proof_received,
  });

  {
    const result = await pg.query.email_domains.findMany({
      where: (table, { eq }) => eq(table.organization_id, organization_id),
    });
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "can_be_suggested": true,
          "created_at": "2222-01-01 00:00:00+00",
          "domain": "unicorn.xyz",
          "id": 1,
          "organization_id": 1,
          "updated_at": "2222-01-01 00:00:00+00",
          "verification_type": "verified",
          "verified_at": null,
        },
      ]
    `);
  }

  const response = await new Hono()
    .use(set_config({}))
    .use(set_identite_pg(pg))
    .use(set_identite_pg_client(client as any))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: "test@example.com" }))
    .route("/:id/domains", app)
    .request(`/${organization_id}/domains`, {
      method: "PUT",
      body: new URLSearchParams({ domain: "unicorn.xyz" }),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

  expect(response.status).toBe(200);
  expect(response.headers.get("HX-Trigger")).toBe(
    "DOMAIN_UPDATED, MEMBERS_UPDATED",
  );

  {
    const result = await pg.query.email_domains.findMany({
      where: (table, { eq }) => eq(table.organization_id, organization_id),
    });
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "can_be_suggested": true,
          "created_at": "2222-01-01 00:00:00+00",
          "domain": "unicorn.xyz",
          "id": 2,
          "organization_id": 1,
          "updated_at": "2222-01-01 00:00:00+00",
          "verification_type": "verified",
          "verified_at": "2222-01-01 00:00:00+00",
        },
      ]
    `);
  }
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
          "updated_at": "2222-01-01 00:00:00+00",
          "user_id": 1,
          "verification_type": "domain",
          "verified_at": null,
        },
        {
          "created_at": "1970-01-01 00:00:00+00",
          "has_been_greeted": false,
          "is_external": false,
          "needs_official_contact_email_verification": false,
          "official_contact_email_verification_sent_at": null,
          "official_contact_email_verification_token": null,
          "organization_id": 1,
          "updated_at": "2222-01-01 00:00:00+00",
          "user_id": 2,
          "verification_type": "domain",
          "verified_at": null,
        },
        {
          "created_at": "1970-01-01 00:00:00+00",
          "has_been_greeted": false,
          "is_external": false,
          "needs_official_contact_email_verification": false,
          "official_contact_email_verification_sent_at": null,
          "official_contact_email_verification_token": null,
          "organization_id": 1,
          "updated_at": "1970-01-01 00:00:00+00",
          "user_id": 3,
          "verification_type": "proof_received",
          "verified_at": null,
        },
      ]
    `);
  }
});

test("DELETE /organizations/:id/domains/:domain_id removes domain", async () => {
  const organization_id = await create_unicorn_organization(pg);

  const [{ id: domain_id } = { id: NaN }] = await pg
    .insert(schema.email_domains)
    .values({
      domain: "tobedeleted.xyz",
      organization_id,
      verification_type: EmailDomainVerificationTypes.enum.not_verified_yet,
    })
    .returning({ id: schema.email_domains.id });

  const response = await new Hono()
    .use(set_config({}))
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: "test@example.com" }))
    .route("/:id/domains", app)
    .request(`/${organization_id}/domains/${domain_id}`, {
      method: "DELETE",
    });

  expect(response.status).toBe(200);
  expect(response.headers.get("HX-Trigger")).toBe("DOMAIN_UPDATED");

  {
    const result = await pg.query.email_domains.findMany({
      where: (table, { eq }) => eq(table.organization_id, organization_id),
    });
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "can_be_suggested": true,
          "created_at": "2222-01-01 00:00:00+00",
          "domain": "unicorn.xyz",
          "id": 1,
          "organization_id": 1,
          "updated_at": "2222-01-01 00:00:00+00",
          "verification_type": "verified",
          "verified_at": null,
        },
      ]
    `);
  }
});

test("PATCH /organizations/:id/domains/:domain_id updates verification type to verified", async () => {
  const organization_id = await create_unicorn_organization(pg);

  const [{ id: domain_id } = { id: NaN }] = await pg
    .insert(schema.email_domains)
    .values({
      domain: "toverify.xyz",
      organization_id,
      verification_type: EmailDomainVerificationTypes.enum.not_verified_yet,
    })
    .returning({ id: schema.email_domains.id });

  const response = await new Hono()
    .use(set_config({}))
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: "test@example.com" }))
    .route("/:id/domains", app)
    .request(`/${organization_id}/domains/${domain_id}?type=verified`, {
      method: "PATCH",
    });

  expect(response.status).toBe(200);
  expect(response.headers.get("HX-Trigger")).toBe("DOMAIN_UPDATED");

  {
    const result = await pg.query.email_domains.findMany({
      where: (table, { eq }) => eq(table.organization_id, organization_id),
    });
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "can_be_suggested": true,
          "created_at": "2222-01-01 00:00:00+00",
          "domain": "toverify.xyz",
          "id": 2,
          "organization_id": 1,
          "updated_at": "2222-01-01 00:00:00+00",
          "verification_type": "verified",
          "verified_at": "2222-01-01 00:00:00+00",
        },
        {
          "can_be_suggested": true,
          "created_at": "2222-01-01 00:00:00+00",
          "domain": "unicorn.xyz",
          "id": 1,
          "organization_id": 1,
          "updated_at": "2222-01-01 00:00:00+00",
          "verification_type": "verified",
          "verified_at": null,
        },
      ]
    `);
  }
});
