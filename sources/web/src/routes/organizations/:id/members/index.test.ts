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
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { Hono } from "hono";
import app from "./index";

//

beforeAll(migrate);
beforeEach(empty_database);
beforeEach(hyyyperbase_empty_database);

//

test("GET /organizations/:id/members returns members for organization", async () => {
  const moderator = await insert_moderateur(hyyyper_pglite);
  const organization_id = await create_unicorn_organization(pg);
  const user_id = await create_adora_pony_user(pg);

  await pg.insert(schema.users_organizations).values({
    user_id,
    organization_id,
    is_external: false,
    verification_type: "domain",
  });

  const response = await new Hono()
    .use(set_config({}))
    .use(set_hyyyper_pg(hyyyper_pglite))
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: moderator.email, sub: moderator.sub! }))
    .use(authorized())
    .route("/:id/members", app)
    .request(
      `/${organization_id}/members?describedby=test-id&page_ref=members-table`,
    );

  expect(response.status).toBe(200);

  const html = await response.text();

  expect(html).toContain("Prénom");
  expect(html).toContain("Nom");
  expect(html).toContain("Email");
  expect(html).toContain("Fonction");

  expect(html).toContain("Adora");
  expect(html).toContain("Pony");
  expect(html).toContain("adora.pony@unicorn.xyz");
  expect(html).toContain("domain");
});

test("GET /organizations/:id/members hides member actions for visitors", async () => {
  const visitor = await insert_jeanbon(hyyyper_pglite);
  const organization_id = await create_unicorn_organization(pg);
  const user_id = await create_adora_pony_user(pg);

  await pg.insert(schema.users_organizations).values({
    user_id,
    organization_id,
    is_external: false,
    verification_type: "domain",
  });

  const response = await new Hono()
    .use(set_config({}))
    .use(set_hyyyper_pg(hyyyper_pglite))
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: visitor.email, sub: visitor.sub! }))
    .use(authorized())
    .route("/:id/members", app)
    .request(
      `/${organization_id}/members?describedby=test-id&page_ref=members-table`,
    );

  expect(response.status).toBe(200);

  const html = await response.text();

  expect(html).not.toContain("retirer de l'orga");
});
