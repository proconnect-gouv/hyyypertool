//

import { authorized, set_userinfo } from "#src/middleware/auth";
import { set_config } from "#src/middleware/config";
import { set_hyyyper_pg } from "#src/middleware/hyyyperbase";
import { set_identite_pg } from "#src/middleware/identite-pg";
import { set_nonce } from "#src/middleware/nonce";
import { empty_database as hyyyperbase_empty_database, hyyyper_pglite } from "@~/hyyyperbase/testing";
import { insert_moderateur } from "@~/hyyyperbase/testing/users";
import { create_unicorn_organization } from "@~/identite-proconnect/database/seed/unicorn";
import { empty_database as identite_empty_database, migrate, pg } from "@~/identite-proconnect/database/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { Hono } from "hono";
import app from "./index";

//

beforeAll(migrate);
beforeEach(identite_empty_database);
beforeEach(hyyyperbase_empty_database);

//

test("GET /organizations/:id returns organization details", async () => {
  const moderator = await insert_moderateur(hyyyper_pglite);
  const organization_id = await create_unicorn_organization(pg);

  const response = await new Hono()
    .use(
      set_config({
        HTTP_CLIENT_TIMEOUT: 5000,
      }),
    )
    .use(set_hyyyper_pg(hyyyper_pglite))
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: moderator.email, sub: moderator.sub! }))
    .use(authorized())
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
