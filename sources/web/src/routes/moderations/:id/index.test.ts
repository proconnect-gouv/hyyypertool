//

import { authorized, set_userinfo } from "#src/middleware/auth";
import { set_config } from "#src/middleware/config";
import { set_hyyyper_pg } from "#src/middleware/hyyyperbase";
import { set_identite_pg } from "#src/middleware/identite-pg";
import { set_nonce } from "#src/middleware/nonce";
import { hyyyper_pglite, reset } from "@~/hyyyperbase/testing";
import { insert_moderateur } from "@~/hyyyperbase/testing/users";
import {
  create_adora_pony_moderation,
  create_adora_pony_user,
  create_unicorn_organization,
} from "@~/identite-proconnect/database/seed/unicorn";
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
beforeEach(reset);
beforeEach(empty_database);
setSystemTime(new Date("2222-01-01T00:00:00.000Z"));

//

test("GET /moderations/:id renders moderation page with user and organization data", async () => {
  const moderator = await insert_moderateur(hyyyper_pglite);
  const user_id = await create_adora_pony_user(pg);
  const organization_id = await create_unicorn_organization(pg);
  const moderation_id = await create_adora_pony_moderation(pg, {
    type: "non_verified_domain",
    status: "pending",
  });

  const response = await new Hono()
    .use(set_config({ HTTP_CLIENT_TIMEOUT: 5000 }))
    .use(set_hyyyper_pg(hyyyper_pglite))
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: moderator.email, sub: moderator.sub! }))
    .use(authorized())
    .route("/:id", app)
    .request(`/${moderation_id}`);

  expect(response.status).toBe(200);
  const html = await response.text();

  expect(html).toContain("Modération non vérifié de Adora Pony pour 🦄 siret");

  expect(html).toContain(`/${organization_id}`);
  expect(html).toContain(`/${user_id}`);
  expect(html).toContain("🦄 siret");
  expect(html).toContain("🦄 libelle");
});

test("GET /moderations/:id returns 404 for non-existent moderation", async () => {
  const moderator = await insert_moderateur(hyyyper_pglite);

  const response = await new Hono()
    .use(set_config({ HTTP_CLIENT_TIMEOUT: 5000 }))
    .use(set_hyyyper_pg(hyyyper_pglite))
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: moderator.email, sub: moderator.sub! }))
    .use(authorized())
    .route("/:id", app)
    .request("/999999");

  expect(response.status).toBe(404);
  const html = await response.text();
  expect(html).toContain("Modération <em>999999</em> non trouvée");
});

//
