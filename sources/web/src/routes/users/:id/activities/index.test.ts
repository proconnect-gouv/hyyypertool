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

function request_activities(
  moderator: { email: string; sub: string | null },
  user_id: number,
) {
  return new Hono()
    .use(set_config({}))
    .use(set_sentry())
    .use(set_hyyyper_pg(hyyyper_pglite))
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: moderator.email, sub: moderator.sub! }))
    .use(authorized())
    .route("/:id/activities", app)
    .request(`/${user_id}/activities`);
}

//

test("GET /users/:id/activities lists the user's activity, newest first, with its cause", async () => {
  const moderator = await insert_moderateur(hyyyper_pglite);
  const organization_id = await create_unicorn_organization(pg);
  const adora_pony_user_id = await create_adora_pony_user(pg);

  const [{ id: cause_id } = { id: NaN }] = await pg
    .insert(schema.activity_logs)
    .values({
      action: "domain.verified",
      actor_ref: moderator.sub!,
      actor_type: "moderator",
      app: "hyyypertool",
      context: {
        inputs: { domain: "unicorn.xyz", verification_type: "verified" },
        outcome: { email_domain_id: 1, replaced_verification_types: [] },
      },
      created_at: "2222-01-01T00:00:00.000Z",
      organization_id,
    })
    .returning({ id: schema.activity_logs.id });

  await pg.insert(schema.activity_logs).values([
    {
      action: "member.promoted",
      actor_ref: "domain.promote_members",
      actor_type: "app",
      app: "proconnect-identite",
      cause_activity_id: cause_id,
      context: {
        inputs: { previous_verification_type: "domain_not_verified_yet" },
        outcome: { verification_type: "domain" },
      },
      created_at: "2222-01-04T00:00:00.000Z",
      organization_id,
      user_id: adora_pony_user_id,
    },
    {
      action: "domain.archived",
      actor_ref: "join.official_contact",
      actor_type: "app",
      app: "proconnect-identite",
      context: { inputs: { domain: "rainbow.xyz" }, outcome: {} },
      created_at: "2222-01-03T00:00:00.000Z",
      user_id: adora_pony_user_id,
    },
    {
      action: "member.promoted",
      actor_ref: "domain.promote_members",
      actor_type: "app",
      app: "proconnect-identite",
      context: { inputs: {}, outcome: {} },
      created_at: "2222-01-02T00:00:00.000Z",
      user_id: adora_pony_user_id,
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
      created_at: "2222-01-01T02:00:00.000Z",
      organization_id,
      user_id: adora_pony_user_id + 999,
    },
  ]);

  const response = await request_activities(moderator, adora_pony_user_id);

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
    `04/01/2222 01:00:00 proconnect-identite (domain.promote_members) 🦄 libelle ⬆️ Membre promu (domain_not_verified_yet → domain) ↳ Suite à : ✅ Domaine unicorn.xyz vérifié (verified) par ${moderator.email}`,
    `03/01/2222 01:00:00 proconnect-identite (join.official_contact) — domain.archived {"inputs":{"domain":"rainbow.xyz"},"outcome":{}}`,
    `02/01/2222 01:00:00 proconnect-identite (domain.promote_members) — ⚠️ Contexte invalide : member.promoted {"inputs":{},"outcome":{}}`,
  ]);
});

test("GET /users/:id/activities says when there is no activity", async () => {
  const moderator = await insert_moderateur(hyyyper_pglite);
  const adora_pony_user_id = await create_adora_pony_user(pg);

  const response = await request_activities(moderator, adora_pony_user_id);

  expect(response.status).toBe(200);
  expect(await response.text()).toContain("Aucune activité.");
});
