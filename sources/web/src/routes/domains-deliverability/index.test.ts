//

import { set_userinfo } from "#src/middleware/auth";
import { set_config } from "#src/middleware/config";
import { set_identite_pg } from "#src/middleware/identite-pg";
import { set_nonce } from "#src/middleware/nonce";
import { schema } from "@~/identite-proconnect/database";
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

beforeAll(() => {
  setSystemTime(new Date("2222-01-01T00:00:00.000Z"));
});

test("GET /email delivrability", async () => {
  await pg.insert(schema.email_deliverability_whitelist).values([
    {
      problematic_email: "test@ch-lehavre.fr",
      email_domain: "ch-lehavre.fr",
      verified_by: "🧟‍♂️ zombie admin",
      verified_at: "2024-01-01T12:00:00Z",
    },
  ]);

  const response = await new Hono()
    .use(set_config({ ALLOWED_USERS: "test@example.com" }))
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: "test@example.com" }))
    .route("/", app)
    .request("/");

  expect(response.status).toBe(200);
  const html = await response.text();
  expect(html).toContain("Délivrabilité des domaines");
  expect(html).toContain("test@ch-lehavre.fr");
  expect(html).toContain("Domaine ch-lehavre.fr");
});

test("PUT /domains-deliverability adds new domain to whitelist", async () => {
  {
    const result = await pg.query.email_deliverability_whitelist.findMany();
    expect(result).toMatchInlineSnapshot(`[]`);
  }

  const response = await new Hono()
    .use(set_config({ ALLOWED_USERS: "test@example.com" }))
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(
      set_userinfo({
        email: "test@example.com",
        given_name: "Jean",
        usual_name: "Dupont",
      }),
    )
    .route("/", app)
    .request("/", {
      method: "PUT",
      body: new URLSearchParams({ problematic_email: "user@newdomain.fr" }),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

  expect(response.status).toBe(201);
  expect(response.headers.get("HX-Trigger")).toBe(
    "domains-deliverability-updated",
  );

  {
    const result = await pg.query.email_deliverability_whitelist.findMany();
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "email_domain": "newdomain.fr",
          "problematic_email": "user@newdomain.fr",
          "verified_at": "2222-01-01 00:00:00+00",
          "verified_by": "Jean Dupont",
        },
      ]
    `);
  }
});

test("DELETE /domains-deliverability/:email_domain removes domain from whitelist", async () => {
  await pg.insert(schema.email_deliverability_whitelist).values({
    problematic_email: "user@tobedeleted.fr",
    email_domain: "tobedeleted.fr",
    verified_by: "Jean Dupont",
    verified_at: "2222-01-01T00:00:00Z",
  });

  {
    const result = await pg.query.email_deliverability_whitelist.findMany();
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "email_domain": "tobedeleted.fr",
          "problematic_email": "user@tobedeleted.fr",
          "verified_at": "2222-01-01 00:00:00+00",
          "verified_by": "Jean Dupont",
        },
      ]
    `);
  }

  const response = await new Hono()
    .use(set_config({ ALLOWED_USERS: "test@example.com" }))
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(
      set_userinfo({
        email: "test@example.com",
        given_name: "Jean",
        usual_name: "Dupont",
      }),
    )
    .route("/", app)
    .request("/tobedeleted.fr", {
      method: "DELETE",
    });

  expect(response.status).toBe(200);
  expect(await response.text()).toBe("OK");
  expect(response.headers.get("HX-Trigger")).toBe(
    "domains-deliverability-updated",
  );

  {
    const result = await pg.query.email_deliverability_whitelist.findMany();
    expect(result).toMatchInlineSnapshot(`[]`);
  }
});
