//

import { authorized, set_userinfo } from "#src/middleware/auth";
import { set_config } from "#src/middleware/config";
import { set_hyyyper_pg } from "#src/middleware/hyyyperbase";
import { set_identite_pg } from "#src/middleware/identite-pg";
import { set_nonce } from "#src/middleware/nonce";
import {
  hyyyper_pglite,
  empty_database as hyyyperbase_empty_database,
} from "@~/hyyyperbase/testing";
import {
  insert_jeanbon,
  insert_moderateur,
} from "@~/hyyyperbase/testing/users";
import {
  create_pink_diamond_user,
  create_unicorn_organization,
} from "@~/identite-proconnect/database/seed/unicorn";
import {
  add_user_to_organization,
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
beforeEach(hyyyperbase_empty_database);
setSystemTime(new Date("2222-01-01T00:00:00.000Z"));

test("GET /users/:id/organizations returns user's organizations", async () => {
  const moderator = await insert_moderateur(hyyyper_pglite);
  const organization_id = await create_unicorn_organization(pg);
  const user_id = await create_pink_diamond_user(pg);
  await add_user_to_organization({
    organization_id,
    user_id,
    verification_type: "domain_not_verified_yet",
  });

  const response = await new Hono()
    .use(set_config({}))
    .use(set_hyyyper_pg(hyyyper_pglite))
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: moderator.email, sub: moderator.sub! }))
    .use(authorized())
    .route("/:id/organizations", app)
    .request(`/${user_id}/organizations?describedby=test&page_ref=test-ref`);

  expect(response.status).toBe(200);
  const html = await response.text();
  expect(html).toContain("🦄 siret");
  expect(html).toContain("🦄 libelle");
  expect(html).toContain("Date de création");
  expect(html).toContain("Siret");
  expect(html).toContain("Libellé");
  expect(html).toContain("domain_not_verified_yet");
  expect(html).toContain("hx-delete");
});

test("GET /users/:id/organizations handles pagination", async () => {
  const moderator = await insert_moderateur(hyyyper_pglite);
  const organization_id = await create_unicorn_organization(pg);
  const user_id = await create_pink_diamond_user(pg);
  await add_user_to_organization({
    organization_id,
    user_id,
    verification_type: "domain_not_verified_yet",
  });

  const response = await new Hono()
    .use(set_config({}))
    .use(set_hyyyper_pg(hyyyper_pglite))
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: moderator.email, sub: moderator.sub! }))
    .use(authorized())
    .route("/:id/organizations", app)
    .request(
      `/${user_id}/organizations?describedby=test&page_ref=test-ref&page=1&page_size=10`,
    );

  expect(response.status).toBe(200);
  const html = await response.text();
  expect(html).toContain("🦄 siret");
  expect(html).toContain("🦄 libelle");
});

test("GET /users/:id/organizations with no organizations", async () => {
  const moderator = await insert_moderateur(hyyyper_pglite);
  const user_id = await create_pink_diamond_user(pg);

  const response = await new Hono()
    .use(set_config({}))
    .use(set_hyyyper_pg(hyyyper_pglite))
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: moderator.email, sub: moderator.sub! }))
    .use(authorized())
    .route("/:id/organizations", app)
    .request(`/${user_id}/organizations?describedby=test&page_ref=test-ref`);

  expect(response.status).toBe(200);
  const html = await response.text();
  // Should still render the table headers even with no organizations
  expect(html).toContain("Date de création");
  expect(html).toContain("Siret");
  expect(html).toContain("Libellé");
});

test("GET /users/:id/organizations hides member actions for visitors", async () => {
  const visitor = await insert_jeanbon(hyyyper_pglite);
  const organization_id = await create_unicorn_organization(pg);
  const user_id = await create_pink_diamond_user(pg);
  await add_user_to_organization({
    organization_id,
    user_id,
    verification_type: "domain_not_verified_yet",
  });

  const response = await new Hono()
    .use(set_config({}))
    .use(set_hyyyper_pg(hyyyper_pglite))
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: visitor.email, sub: visitor.sub! }))
    .use(authorized())
    .route("/:id/organizations", app)
    .request(`/${user_id}/organizations?describedby=test&page_ref=test-ref`);

  expect(response.status).toBe(200);
  const html = await response.text();
  expect(html).toContain("🦄 siret");
  expect(html).toContain("domain_not_verified_yet");
  expect(html).not.toContain("hx-delete");
});
