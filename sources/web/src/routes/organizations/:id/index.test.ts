//

import { set_userinfo } from "#src/middleware/auth";
import { set_config } from "#src/middleware/config";
import { set_identite_pg } from "#src/middleware/identite-pg";
import { set_nonce } from "#src/middleware/nonce";
import { create_unicorn_organization } from "@~/identite-proconnect/database/seed/unicorn";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/database/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { Hono } from "hono";
import app from "./index";

//

beforeAll(migrate);
beforeEach(empty_database);

//

test("GET /organizations/:id returns organization details", async () => {
  const organization_id = await create_unicorn_organization(pg);

  const response = await new Hono()
    .use(
      set_config({
        ALLOWED_USERS: "test@example.com",
        HTTP_CLIENT_TIMEOUT: 5000,
      }),
    )
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: "test@example.com" }))
    .route("/:id", app)
    .request(`/${organization_id}`);

  expect(response.status).toBe(200);

  const html = await response.text();

  // Check for organization title section (apostrophe is HTML-encoded)
  expect(html).toContain("🏛 A propos de l&#39;organisation");

  // Verify organization data is displayed
  expect(html).toContain("🦄 libelle"); // cached_libelle from unicorn seed
  expect(html).toContain("🦄 siret"); // siret from unicorn seed

  // Check for domains section
  expect(html).toContain("🌐");
  expect(html).toContain("domaine");

  // Check for members section
  expect(html).toContain("👥");
  expect(html).toContain("membre");
});
