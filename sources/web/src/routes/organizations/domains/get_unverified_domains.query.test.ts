//

import { schema } from "@~/identite-proconnect/database";
import { create_cactus_organization } from "@~/identite-proconnect/database/seed/captus";
import { create_troll_organization } from "@~/identite-proconnect/database/seed/troll";
import {
  create_adora_pony_user,
  create_unicorn_organization,
} from "@~/identite-proconnect/database/seed/unicorn";
import { create_zombie_organization } from "@~/identite-proconnect/database/seed/zombie";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/database/testing";
import { EMAIL_DOMAIN_APPROVED_VERIFICATION_TYPES } from "@~/identite-proconnect/types";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { get_unverified_domains } from "./get_unverified_domains.query";

//

beforeAll(migrate);
beforeEach(empty_database);

//

test("returns bi.corn then troll.corn organizations", async () => {
  await create_cactus_organization(pg);

  const troll_organization_id = await create_troll_organization(pg);
  await pg.insert(schema.email_domains).values({
    domain: "troll.corn",
    organization_id: troll_organization_id,
  });

  const unicorn_organization_id = await create_unicorn_organization(pg);
  const adora_pony_user_id = await create_adora_pony_user(pg);
  await pg.insert(schema.users_organizations).values({
    organization_id: unicorn_organization_id,
    user_id: adora_pony_user_id,
  });

  await pg.insert(schema.moderations).values({
    organization_id: unicorn_organization_id,
    user_id: adora_pony_user_id,
    type: "",
  });

  await pg.insert(schema.email_domains).values({
    domain: "bi.corn",
    organization_id: unicorn_organization_id,
  });

  const result = await get_unverified_domains(pg, {});

  expect(result).toEqual({
    count: 2,
    domains: [
      {
        domain: "bi.corn",
        id: expect.any(Number),
        organization: {
          cached_libelle: "🦄 libelle",
          created_at: "1970-01-01 00:00:00+00",
          id: unicorn_organization_id,
          siret: "🦄 siret",
        },
      },
      {
        domain: "troll.corn",
        id: expect.any(Number),
        organization: {
          cached_libelle: "🧌 libelle",
          created_at: "1970-01-01 00:00:00+00",
          id: troll_organization_id,
          siret: "🧌 siret",
        },
      },
    ],
  });
});

test("search for bi.corn organization", async () => {
  await create_cactus_organization(pg);
  const troll_organization_id = await create_troll_organization(pg);
  await pg.insert(schema.email_domains).values({
    domain: "troll.corn",
    organization_id: troll_organization_id,
  });

  const unicorn_organization_id = await create_unicorn_organization(pg);
  await pg.insert(schema.email_domains).values({
    domain: "bi.corn",
    organization_id: unicorn_organization_id,
  });

  const result = await get_unverified_domains(pg, {
    search: "bi.corn",
  });

  expect(result).toEqual({
    count: 1,
    domains: [
      {
        domain: "bi.corn",
        id: expect.any(Number),
        organization: {
          cached_libelle: "🦄 libelle",
          created_at: "1970-01-01 00:00:00+00",
          id: unicorn_organization_id,
          siret: "🦄 siret",
        },
      },
    ],
  });
});

test("search for 🦄 libelle organization", async () => {
  await create_cactus_organization(pg);
  const troll_organization_id = await create_troll_organization(pg);
  await pg.insert(schema.email_domains).values({
    domain: "troll.corn",
    organization_id: troll_organization_id,
  });

  const unicorn_organization_id = await create_unicorn_organization(pg);
  await pg.insert(schema.email_domains).values({
    domain: "bi.corn",
    organization_id: unicorn_organization_id,
  });

  const result = await get_unverified_domains(pg, {
    search: "🦄 libelle",
  });

  expect(result).toEqual({
    count: 1,
    domains: [
      {
        domain: "bi.corn",
        id: expect.any(Number),
        organization: {
          cached_libelle: "🦄 libelle",
          created_at: "1970-01-01 00:00:00+00",
          id: unicorn_organization_id,
          siret: "🦄 siret",
        },
      },
    ],
  });
});

test("search for 🦄 siret organization", async () => {
  await create_cactus_organization(pg);
  const troll_organization_id = await create_troll_organization(pg);
  await pg.insert(schema.email_domains).values({
    domain: "troll.corn",
    organization_id: troll_organization_id,
  });

  const unicorn_organization_id = await create_unicorn_organization(pg);
  await pg.insert(schema.email_domains).values({
    domain: "bi.corn",
    organization_id: unicorn_organization_id,
  });

  const result = await get_unverified_domains(pg, {
    search: "🦄 siret",
  });

  expect(result).toEqual({
    count: 1,
    domains: [
      {
        domain: "bi.corn",
        id: expect.any(Number),
        organization: {
          cached_libelle: "🦄 libelle",
          created_at: "1970-01-01 00:00:00+00",
          id: unicorn_organization_id,
          siret: "🦄 siret",
        },
      },
    ],
  });
});

test.each(
  [
    "Entrepreneur individuel",
    "Société à responsabilité limitée (sans autre indication)",
    "SAS, société par actions simplifiée",
  ].flatMap((categorie_juridique) => [
    { categorie_juridique, tranche_effectifs: null },
    { categorie_juridique, tranche_effectifs: "NN" },
    { categorie_juridique, tranche_effectifs: "00" },
    { categorie_juridique, tranche_effectifs: "01" },
  ]),
)(
  "returns no unipersonnelle organizations %p",
  async ({ categorie_juridique, tranche_effectifs }) => {
    {
      const [{ organization_id } = { organization_id: NaN }] = await pg
        .insert(schema.organizations)
        .values({
          siret: categorie_juridique,
          cached_libelle_categorie_juridique: categorie_juridique,
          cached_tranche_effectifs: tranche_effectifs,
        })
        .returning({ organization_id: schema.organizations.id });
      await pg.insert(schema.email_domains).values({
        domain: categorie_juridique,
        organization_id,
      });
    }

    const result = await get_unverified_domains(pg, {});
    expect(result).toEqual({ count: 0, domains: [] });
  },
);

test("returns no organizations verified by Trackdechets", async () => {
  await create_unicorn_organization(pg);
  const troll_organization_id = await create_troll_organization(pg);
  await pg.insert(schema.email_domains).values({
    domain: "troll.corn",
    organization_id: troll_organization_id,
    verification_type:
      EMAIL_DOMAIN_APPROVED_VERIFICATION_TYPES.enum.trackdechets_postal_mail,
  });
  const result = await get_unverified_domains(pg, {});
  expect(result).toEqual({ count: 0, domains: [] });
});

test("returns no unactive organizations", async () => {
  await create_zombie_organization(pg);
  const result = await get_unverified_domains(pg, {});
  expect(result).toEqual({ count: 0, domains: [] });
});

test("returns no free domain organizations", async () => {
  const unicorn_organization_id = await create_unicorn_organization(pg);
  await pg.insert(schema.email_domains).values({
    domain: "gmail.com",
    organization_id: unicorn_organization_id,
  });

  const result = await get_unverified_domains(pg, {});
  expect(result).toEqual({ count: 0, domains: [] });
});
