//

import { authorized, set_userinfo } from "#src/middleware/auth";
import { set_config } from "#src/middleware/config";
import { set_hyyyper_pg } from "#src/middleware/hyyyperbase";
import { set_identite_pg } from "#src/middleware/identite-pg";
import { set_nonce } from "#src/middleware/nonce";
import { set_sentry } from "#src/middleware/sentry";
import {
  hyyyper_pglite,
  empty_database as hyyyperbase_empty_database,
} from "@~/hyyyperbase/testing";
import { insert_moderateur } from "@~/hyyyperbase/testing/users";
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

function request_history(
  moderator: { email: string; sub: string | null },
  organization_id: number,
) {
  return new Hono()
    .use(set_config({}))
    .use(set_sentry())
    .use(set_hyyyper_pg(hyyyper_pglite))
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: moderator.email, sub: moderator.sub! }))
    .use(authorized())
    .route("/:id/domains/history", app)
    .request(`/${organization_id}/domains/history`);
}

//

test("GET /organizations/:id/domains/history lists the organization's domain activity, newest first", async () => {
  const moderator = await insert_moderateur(hyyyper_pglite);
  const organization_id = await create_unicorn_organization(pg);
  const adora_pony_user_id = await create_adora_pony_user(pg);

  await pg.insert(schema.activity_logs).values([
    {
      action: "domain.verified",
      actor_ref: "join.official_contact",
      actor_type: "app",
      app: "proconnect-identite",
      context: {
        inputs: {
          domain: "unicorn.xyz",
          verification_type: "official_contact",
        },
        outcome: { email_domain_id: 1, replaced_verification_types: [] },
      },
      created_at: "2222-01-01T00:00:00.000Z",
      organization_id,
    },
    {
      action: "domain.refused",
      actor_ref: moderator.sub!,
      actor_type: "moderator",
      app: "hyyypertool",
      context: {
        inputs: { domain: "rainbow.xyz", verification_type: "refused" },
        outcome: { email_domain_id: 2, replaced_verification_types: [] },
      },
      created_at: "2222-01-02T00:00:00.000Z",
      organization_id,
    },
    {
      action: "domain.removed",
      actor_ref: "unknown-sub",
      actor_type: "moderator",
      app: "hyyypertool",
      context: { inputs: { domain: "rainbow.xyz" }, outcome: {} },
      created_at: "2222-01-03T00:00:00.000Z",
      organization_id,
    },
    {
      action: "domain.refused",
      actor_ref: moderator.sub!,
      actor_type: "moderator",
      app: "hyyypertool",
      context: { inputs: { domain: "broken.xyz" }, outcome: {} },
      created_at: "2222-01-04T00:00:00.000Z",
      organization_id,
    },
    {
      action: "member.promoted",
      actor_ref: "domain.promote_members",
      actor_type: "app",
      app: "proconnect-identite",
      cause_activity_id: 1,
      context: {
        inputs: { previous_verification_type: "domain_not_verified_yet" },
        outcome: { verification_type: "domain" },
      },
      created_at: "2222-01-01T00:00:00.000Z",
      organization_id,
      user_id: adora_pony_user_id,
    },
    {
      action: "member.promoted",
      actor_ref: "domain.promote_members",
      actor_type: "app",
      app: "proconnect-identite",
      cause_activity_id: 1,
      context: {
        inputs: { previous_verification_type: "no_validation_means_available" },
        outcome: { verification_type: "domain" },
      },
      created_at: "2222-01-01T00:00:00.000Z",
      organization_id,
      user_id: 999,
    },
    {
      action: "member.promoted",
      actor_ref: "domain.promote_members",
      actor_type: "app",
      app: "proconnect-identite",
      context: {
        inputs: { previous_verification_type: "domain_not_verified_yet" },
        outcome: { verification_type: "domain" },
      },
      created_at: "2222-01-05T00:00:00.000Z",
      organization_id,
      user_id: adora_pony_user_id,
    },
    {
      action: "domain.refused",
      actor_ref: moderator.sub!,
      actor_type: "moderator",
      app: "hyyypertool",
      context: {
        inputs: { domain: "elsewhere.xyz", verification_type: "refused" },
        outcome: { email_domain_id: 3, replaced_verification_types: [] },
      },
      organization_id: organization_id + 1,
    },
  ]);

  const response = await request_history(moderator, organization_id);

  expect(response.status).toBe(200);
  const rows = [
    ...(await response.text()).matchAll(
      /<tr aria-label="Activité[^"]*">.*?<\/tr>/gs,
    ),
  ].map(([row]) =>
    row
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .replaceAll("&quot;", '"')
      .trim(),
  );
  expect(rows).toEqual([
    `04/01/2222 01:00:00 ${moderator.email} ⚠️ Contexte invalide : domain.refused {"inputs":{"domain":"broken.xyz"},"outcome":{}}`,
    `03/01/2222 01:00:00 unknown-sub domain.removed {"inputs":{"domain":"rainbow.xyz"},"outcome":{}}`,
    `02/01/2222 01:00:00 ${moderator.email} 🚫 Domaine rainbow.xyz refusé`,
    `01/01/2222 01:00:00 proconnect-identite (join.official_contact) ✅ Domaine unicorn.xyz vérifié (official_contact) adora.pony@unicorn.xyz : ⬆️ Membre promu (domain_not_verified_yet → domain) utilisateur #999 : ⬆️ Membre promu (no_validation_means_available → domain)`,
  ]);
});

test("GET /organizations/:id/domains/history says when there is no history", async () => {
  const moderator = await insert_moderateur(hyyyper_pglite);
  const organization_id = await create_unicorn_organization(pg);

  const response = await request_history(moderator, organization_id);

  expect(response.status).toBe(200);
  expect(await response.text()).toContain("Aucun historique.");
});
