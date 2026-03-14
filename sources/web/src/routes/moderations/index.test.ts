//

import { set_userinfo } from "#src/middleware/auth";
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
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { Hono } from "hono";
import app from "./index";

//

beforeAll(migrate);
beforeEach(reset);
beforeEach(empty_database);

function create_test_app(moderator: { email: string; sub: string | null }) {
  return new Hono()
    .onError((e) => {
      throw e;
    })
    .use(set_hyyyper_pg(hyyyper_pglite))
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(
      set_userinfo({
        email: moderator.email,
        sub: moderator.sub!,
      }),
    )
    .route("/", app);
}

test("GET /moderations returns moderations list page", async () => {
  const moderator = await insert_moderateur(hyyyper_pglite);
  await create_unicorn_organization(pg);
  await create_adora_pony_user(pg);
  const moderation_id = await create_adora_pony_moderation(pg, { type: "💼" });

  const response = await create_test_app(moderator).request("/", undefined, {});

  const html = await response.text();
  expect(html).toContain("Liste des moderations");
  expect(html).toContain("adora.pony@unicorn.xyz");
  expect(html).toContain("Modération ⁉️ 💼 de Adora Pony pour 🦄 siret");
  expect(html).toContain(`/moderations/${moderation_id}`);
  expect(response.status).toBe(200);
});

test("GET /moderations?q= (empty query) lists all moderations", async () => {
  const moderator = await insert_moderateur(hyyyper_pglite);
  await create_unicorn_organization(pg);
  await create_adora_pony_user(pg);
  const pending_id = await create_adora_pony_moderation(pg, { type: "💼" });
  const processed_id = await create_adora_pony_moderation(pg, {
    type: "💼",
    moderated_at: "2222-01-01T00:00:00.000Z",
  });

  const response = await create_test_app(moderator).request(
    "/?q=",
    undefined,
    {},
  );

  const html = await response.text();
  expect(html).toContain(`/moderations/${pending_id}`);
  expect(html).toContain(`/moderations/${processed_id}`);
  expect(response.status).toBe(200);
});

test("GET /moderations?q=is:processed shows only processed moderations", async () => {
  const moderator = await insert_moderateur(hyyyper_pglite);
  await create_unicorn_organization(pg);
  await create_adora_pony_user(pg);
  const pending_id = await create_adora_pony_moderation(pg, { type: "💼" });
  const processed_id = await create_adora_pony_moderation(pg, {
    type: "💼",
    moderated_at: "2222-01-01T00:00:00.000Z",
  });

  const response = await create_test_app(moderator).request(
    "/?q=is:processed",
    undefined,
    {},
  );

  const html = await response.text();
  expect(html).toContain(`/moderations/${processed_id}`);
  expect(html).not.toContain(`/moderations/${pending_id}`);
  expect(response.status).toBe(200);
});

test("GET /moderations?q=email:adora filters by email", async () => {
  const moderator = await insert_moderateur(hyyyper_pglite);
  await create_unicorn_organization(pg);
  await create_adora_pony_user(pg);
  const moderation_id = await create_adora_pony_moderation(pg, { type: "💼" });

  const response = await create_test_app(moderator).request(
    "/?q=email:adora",
    undefined,
    {},
  );

  const html = await response.text();
  expect(html).toContain(`/moderations/${moderation_id}`);
  expect(response.status).toBe(200);
});

test("GET /moderations?q=-email:adora excludes emails containing 'adora'", async () => {
  const moderator = await insert_moderateur(hyyyper_pglite);
  await create_unicorn_organization(pg);
  await create_adora_pony_user(pg);
  const moderation_id = await create_adora_pony_moderation(pg, { type: "💼" });

  const response = await create_test_app(moderator).request(
    "/?q=-email:adora",
    undefined,
    {},
  );

  const html = await response.text();
  expect(html).not.toContain(`/moderations/${moderation_id}`);
  expect(response.status).toBe(200);
});

test("GET /moderations?q=email:nonexistent returns no moderations", async () => {
  const moderator = await insert_moderateur(hyyyper_pglite);
  await create_unicorn_organization(pg);
  await create_adora_pony_user(pg);
  const moderation_id = await create_adora_pony_moderation(pg, { type: "💼" });

  const response = await create_test_app(moderator).request(
    "/?q=email:nonexistent",
    undefined,
    {},
  );

  const html = await response.text();
  expect(html).not.toContain(`/moderations/${moderation_id}`);
  expect(response.status).toBe(200);
});

test("GET /moderations?q=is:pending shows only pending moderations", async () => {
  const moderator = await insert_moderateur(hyyyper_pglite);
  await create_unicorn_organization(pg);
  await create_adora_pony_user(pg);
  const pending_id = await create_adora_pony_moderation(pg, { type: "💼" });
  const processed_id = await create_adora_pony_moderation(pg, {
    type: "💼",
    moderated_at: "2222-01-01T00:00:00.000Z",
  });

  const response = await create_test_app(moderator).request(
    "/?q=is:pending",
    undefined,
    {},
  );

  const html = await response.text();
  expect(html).toContain(`/moderations/${pending_id}`);
  expect(html).not.toContain(`/moderations/${processed_id}`);
  expect(response.status).toBe(200);
});
