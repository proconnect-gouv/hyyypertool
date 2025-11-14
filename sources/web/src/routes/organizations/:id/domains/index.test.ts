//

import { set_userinfo } from "#src/middleware/auth";
import { set_config } from "#src/middleware/config";
import { set_identite_pg } from "#src/middleware/identite-pg";
import { set_nonce } from "#src/middleware/nonce";
import { schema } from "@~/identite-proconnect/database";
import { create_unicorn_organization } from "@~/identite-proconnect/database/seed/unicorn";
import { empty_database, migrate, pg } from "@~/identite-proconnect/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { Hono } from "hono";
import app from "./index";

//

beforeAll(migrate);
beforeEach(empty_database);

//

test("GET /organizations/:id/domains returns domains for organization", async () => {
  const organization_id = await create_unicorn_organization(pg);

  await pg.insert(schema.email_domains).values({
    domain: "rainbow.xyz",
    organization_id,
    verification_type: null,
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
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: "test@example.com" }))
    .route("/:id/domains", app)
    .request(`/${organization_id}/domains`, {
      method: "PUT",
      body: new URLSearchParams({ domain: "newdomain.xyz" }),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
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
          "domain": "newdomain.xyz",
          "id": 2,
          "organization_id": 1,
          "updated_at": "2222-01-01 00:00:00+00",
          "verification_type": "verified",
          "verified_at": null,
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

test("DELETE /organizations/:id/domains/:domain_id removes domain", async () => {
  const organization_id = await create_unicorn_organization(pg);

  const [{ id: domain_id }] = await pg
    .insert(schema.email_domains)
    .values({
      domain: "tobedeleted.xyz",
      organization_id,
      verification_type: null,
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

  const [{ id: domain_id }] = await pg
    .insert(schema.email_domains)
    .values({
      domain: "toverify.xyz",
      organization_id,
      verification_type: null,
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

test("PATCH /organizations/:id/domains/:domain_id updates verification type to null", async () => {
  const organization_id = await create_unicorn_organization(pg);

  const [{ id: domain_id }] = await pg
    .insert(schema.email_domains)
    .values({
      domain: "tounverify.xyz",
      organization_id,
      verification_type: "verified",
      verified_at: new Date().toISOString(),
    })
    .returning({ id: schema.email_domains.id });

  const response = await new Hono()
    .use(set_config({}))
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: "test@example.com" }))
    .route("/:id/domains", app)
    .request(`/${organization_id}/domains/${domain_id}?type=null`, {
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
          "domain": "tounverify.xyz",
          "id": 2,
          "organization_id": 1,
          "updated_at": "2222-01-01 00:00:00+00",
          "verification_type": null,
          "verified_at": null,
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
