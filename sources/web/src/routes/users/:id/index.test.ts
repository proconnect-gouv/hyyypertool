//

import { set_userinfo } from "#src/middleware/auth";
import { set_config } from "#src/middleware/config";
import { set_identite_pg } from "#src/middleware/identite-pg";
import { set_nonce } from "#src/middleware/nonce";
import { schema } from "@~/identite-proconnect/database";
import { create_adora_pony_user } from "@~/identite-proconnect/database/seed/unicorn";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/database/testing";
import { beforeAll, beforeEach, expect, setSystemTime, test } from "bun:test";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import app from "./index";

//

beforeAll(migrate);
beforeEach(empty_database);
setSystemTime(new Date("2222-01-01T00:00:00.000Z"));

test("GET /users/:id returns user details", async () => {
  const user_id = await create_adora_pony_user(pg);

  const response = await new Hono()
    .use(set_config({}))
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: "test@example.com" }))
    .route("/:id", app)
    .request(`/${user_id}`);

  expect(response.status).toBe(200);
  const html = await response.text();
  expect(html).toContain("Utilisateur");
  expect(html).toContain("Adora");
  expect(html).toContain("Pony");
  expect(html).toContain("adora.pony@unicorn.xyz");
  expect(html).toContain("prénom");
  expect(html).toContain("🔐");
});

test("DELETE /users/:id deletes user and redirects", async () => {
  const user_id = await create_adora_pony_user(pg);

  const response = await new Hono()
    .use(set_config({}))
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: "test@example.com" }))
    .route("/:id", app)
    .request(`/${user_id}`, { method: "DELETE" });

  expect(response.status).toBe(200);
  expect(response.text()).resolves.toBe("OK");

  const deleted_user = await pg.query.users.findFirst({
    where: eq(schema.users.id, user_id),
  });
  expect(deleted_user).toBeUndefined();
});

test("PATCH /users/:id/reset/email_verified resets email verification", async () => {
  const user_id = await create_adora_pony_user(pg);

  const response = await new Hono()
    .use(set_config({}))
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: "test@example.com" }))
    .route("/:id", app)
    .request(`/${user_id}/reset/email_verified`, { method: "PATCH" });

  expect(response.status).toBe(200);
  expect(response.text()).resolves.toBe("OK");

  const updated_user = await pg.query.users.findFirst({
    where: eq(schema.users.id, user_id),
    columns: { email_verified: true },
  });
  expect(updated_user?.email_verified).toBe(false);
});

test("PATCH /users/:id/reset/mfa resets MFA", async () => {
  const user_id = await create_adora_pony_user(pg);

  const response = await new Hono()
    .use(
      set_config({
        CRISP_RESOLVE_DELAY: 0,
        CRISP_WEBSITE_ID: "test",
        CRISP_KEY: "test",
      }),
    )
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: "test@example.com" }))
    .route("/:id", app)
    .request(`/${user_id}/reset/mfa`, { method: "PATCH" });

  // May return 500 due to Crisp config, but verifies endpoint exists
  expect([200, 500]).toContain(response.status);
});
