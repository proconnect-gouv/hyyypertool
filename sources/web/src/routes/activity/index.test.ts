//

import { set_userinfo } from "#src/middleware/auth";
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
  empty_database as identite_empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/database/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { Hono } from "hono";
import app from "./index";

//

beforeAll(migrate);
beforeEach(identite_empty_database);
beforeEach(hyyyperbase_empty_database);

function create_test_app(moderator: { email: string; sub: string | null }) {
  return new Hono()
    .onError((error) => {
      throw error;
    })
    .use(set_config({}))
    .use(set_sentry())
    .use(set_hyyyper_pg(hyyyper_pglite))
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: moderator.email, sub: moderator.sub! }))
    .route("/", app);
}

function row_texts(html: string) {
  return [...html.matchAll(/<tr aria-label="Activité[^"]*">.*?<\/tr>/gs)].map(
    ([row]) =>
      row
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .replaceAll("&quot;", '"')
        .trim(),
  );
}

async function insert_activities() {
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
      user_id: adora_pony_user_id,
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
      created_at: "2222-01-02T00:00:00.000Z",
      organization_id,
      user_id: adora_pony_user_id,
    },
    {
      action: "moderation.accepted",
      actor_ref: moderator.sub!,
      actor_type: "moderator",
      app: "hyyypertool",
      context: { inputs: {}, outcome: {} },
      created_at: "2222-01-03T00:00:00.000Z",
      moderation_id: 42,
      organization_id,
      user_id: adora_pony_user_id,
    },
    {
      action: "user.deleted",
      actor_ref: moderator.sub!,
      actor_type: "moderator",
      app: "hyyypertool",
      context: {
        inputs: { user_id: adora_pony_user_id },
        outcome: {
          email: "adora.pony@unicorn.xyz",
          family_name: "Pony",
          given_name: "Adora",
          memberships: [],
        },
      },
      created_at: "2222-01-04T00:00:00.000Z",
      user_id: adora_pony_user_id,
    },
    {
      action: "domain.refused",
      actor_ref: moderator.sub!,
      actor_type: "moderator",
      app: "hyyypertool",
      context: { inputs: {}, outcome: {} },
      created_at: "2222-01-05T00:00:00.000Z",
    },
    {
      action: "member.joined",
      actor_ref: moderator.sub!,
      actor_type: "moderator",
      app: "hyyypertool",
      context: {
        inputs: { is_external: true, verification_type: "domain" },
        outcome: {},
      },
      created_at: "2222-01-06T00:00:00.000Z",
    },
    {
      action: "member.removed",
      actor_ref: `${adora_pony_user_id}`,
      actor_type: "user",
      app: "proconnect-identite",
      context: {
        inputs: {},
        outcome: { is_external: false, verification_type: "domain" },
      },
      created_at: "2222-01-07T00:00:00.000Z",
    },
  ]);

  return { adora_pony_user_id, moderator };
}

//

test("GET /activity lists the latest activities with their targets, newest first", async () => {
  const { adora_pony_user_id, moderator } = await insert_activities();

  const response = await create_test_app(moderator).request("/");

  expect(response.status).toBe(200);
  const html = await response.text();
  expect(html).toContain("Journal d’activité");
  expect(html).toContain("▶️ Suivre en direct");
  expect(html).not.toContain("every 5s");
  expect(html).toContain(
    `<a href="/users/${adora_pony_user_id}">adora.pony@unicorn.xyz</a>`,
  );
  expect(row_texts(html)).toEqual([
    `07/01/22 à 01h00 Organisation Membre supprimé (domain, interne) Par adora.pony@unicorn.xyz`,
    `06/01/22 à 01h00 Organisation Membre ajouté (domain, externe) Par ${moderator.email}`,
    `05/01/22 à 01h00 Domaine ⚠️ Contexte invalide : domain.refused {"inputs":{},"outcome":{}} Par ${moderator.email}`,
    `04/01/22 à 01h00 Compte Utilisateur adora.pony@unicorn.xyz supprimé Par ${moderator.email} · adora.pony@unicorn.xyz`,
    `03/01/22 à 01h00 Modération moderation.accepted {"inputs":{},"outcome":{}} Par ${moderator.email} · 🦄 libelle · adora.pony@unicorn.xyz · Modération #42`,
    `02/01/22 à 01h00 Organisation Membre promu (domain_not_verified_yet → domain) Par proconnect-identite (domain.promote_members) · 🦄 libelle · adora.pony@unicorn.xyz ↳ Suite à : Domaine unicorn.xyz vérifié (verified) par ${moderator.email}`,
    `01/01/22 à 01h00 Domaine Domaine unicorn.xyz vérifié (verified) Par ${moderator.email} · 🦄 libelle · adora.pony@unicorn.xyz`,
  ]);
});

test("GET /activity renders one checkbox per activity category", async () => {
  const { moderator } = await insert_activities();

  const html = await (await create_test_app(moderator).request("/")).text();

  expect(html).toContain('name="category" type="checkbox" value="domain"');
  expect(html).toContain('name="category" type="checkbox" value="member"');
  expect(html).toContain('name="category" type="checkbox" value="moderation"');
  expect(html).toContain('name="category" type="checkbox" value="user"');
  expect(html.indexOf("Par catégorie")).toBeLessThan(
    html.indexOf('name="category"'),
  );
  expect(html).toContain("Domaines");
  expect(html).not.toContain("type:domain.verified");
});

test("GET /activity?category= filters by first action category", async () => {
  const { moderator } = await insert_activities();

  const response =
    await create_test_app(moderator).request("/?category=domain");

  expect(row_texts(await response.text())).toEqual([
    `05/01/22 à 01h00 Domaine ⚠️ Contexte invalide : domain.refused {"inputs":{},"outcome":{}} Par ${moderator.email}`,
    `01/01/22 à 01h00 Domaine Domaine unicorn.xyz vérifié (verified) Par ${moderator.email} · 🦄 libelle · adora.pony@unicorn.xyz`,
  ]);
});

test("GET /activity?category= accepts several categories", async () => {
  const { moderator } = await insert_activities();

  const response = await create_test_app(moderator).request(
    "/?category=member&category=moderation",
  );

  const rows = row_texts(await response.text());
  expect(rows).toHaveLength(4);
  expect(rows[0]).toContain("Membre supprimé");
  expect(rows[1]).toContain("Membre ajouté");
  expect(rows[2]).toContain("moderation.accepted");
  expect(rows[3]).toContain("Membre promu");
});

test("GET /activity?date= filters by the Europe/Paris day", async () => {
  const { moderator } = await insert_activities();

  const response =
    await create_test_app(moderator).request("/?date=2222-01-03");

  expect(row_texts(await response.text())).toEqual([
    `03/01/22 à 01h00 Modération moderation.accepted {"inputs":{},"outcome":{}} Par ${moderator.email} · 🦄 libelle · adora.pony@unicorn.xyz · Modération #42`,
  ]);
});

test("GET /activity renders the date input and keeps a valid date in it", async () => {
  const { moderator } = await insert_activities();

  const html = await (
    await create_test_app(moderator).request("/?date=2222-01-03")
  ).text();

  expect(html).toContain("Chercher par date");
  expect(html).toContain('name="date" type="date" value="2222-01-03"');
});

test("GET /activity ignores an unparsable date", async () => {
  const { moderator } = await insert_activities();

  const response = await create_test_app(moderator).request("/?date=oops");

  expect(row_texts(await response.text())).toHaveLength(7);
});

test("GET /activity?live=5 polls every 5 seconds until paused", async () => {
  const { moderator } = await insert_activities();

  const response = await create_test_app(moderator).request("/?live=5");

  const html = await response.text();
  expect(html).toContain("every 5s");
  expect(html).toContain("⏸️ Pause");
});

test("GET /activity keeps the date filter when pausing the live poll", async () => {
  const { moderator } = await insert_activities();

  const html = await (
    await create_test_app(moderator).request("/?date=2222-01-03&live=5")
  ).text();

  expect(html).toContain('href="/activity?date=2222-01-03&amp;live=0"');
});
test("GET /activity says when there is no activity", async () => {
  const moderator = await insert_moderateur(hyyyper_pglite);

  const response = await create_test_app(moderator).request("/");

  expect(response.status).toBe(200);
  expect(await response.text()).toContain("Aucune activité.");
});
