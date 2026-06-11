//

import { set_userinfo } from "#src/middleware/auth";
import { set_config } from "#src/middleware/config";
import { set_identite_pg } from "#src/middleware/identite-pg";
import { set_nonce } from "#src/middleware/nonce";
import {
  create_adora_pony_oidc_connection,
  create_adora_pony_user,
  create_unicorn_oidc_client,
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
beforeEach(empty_database);
setSystemTime(new Date("2222-01-01T00:00:00.000Z"));

//

test("GET /users/:id/oidc_clients renders connection history", async () => {
  const user_id = await create_adora_pony_user(pg);
  await create_unicorn_oidc_client(pg);
  await create_adora_pony_oidc_connection(pg, { sp_name: "🦄 sp" });

  const response = await new Hono()
    .use(set_config({}))
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: "test@example.com" }))
    .route("/:id/oidc_clients", app)
    .request(`/${user_id}/oidc_clients?describedby=test&page_ref=test-ref`);

  const html = await response.text();
  expect(html).toContain("Service");
  expect(html).toContain("Organisation");
  expect(html).toContain("🦄 client_name");
  expect(html).toContain("🦄 sp");
  expect(response.status).toBe(200);
});

test("GET /users/:id/oidc_clients handles pagination", async () => {
  const user_id = await create_adora_pony_user(pg);
  await create_unicorn_oidc_client(pg);
  await create_adora_pony_oidc_connection(pg, { sp_name: "🦄 sp" });

  const response = await new Hono()
    .use(set_config({}))
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: "test@example.com" }))
    .route("/:id/oidc_clients", app)
    .request(
      `/${user_id}/oidc_clients?describedby=test&page_ref=test-ref&page=1&page_size=10`,
    );

  expect(response.status).toBe(200);
  const html = await response.text();
  expect(html).toContain("🦄 client_name");
  expect(html).toContain("Suivant");
});

test("GET /users/:id/oidc_clients with no connections renders empty table", async () => {
  const user_id = await create_adora_pony_user(pg);

  const response = await new Hono()
    .use(set_config({}))
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: "test@example.com" }))
    .route("/:id/oidc_clients", app)
    .request(`/${user_id}/oidc_clients?describedby=test&page_ref=test-ref`);

  const html = await response.text();
  expect(html).toContain("Service");
  expect(html).toContain("Organisation");
  expect(response.status).toBe(200);
});
