//

import { NotFoundError } from "#src/errors";
import { create_unicorn_organization } from "@~/identite-proconnect/database/seed/unicorn";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { GetOrganizationById } from "./GetOrganizationById";

//

beforeAll(migrate);
beforeEach(empty_database);

test("returns organization with partial fields", async () => {
  const organization_id = await create_unicorn_organization(pg);

  const get_organization_by_id = GetOrganizationById(pg, {
    columns: {
      cached_libelle: true,
      cached_nom_complet: true,
      id: true,
      siret: true,
    },
  });
  const result = await get_organization_by_id(organization_id);

  expect(result).toMatchInlineSnapshot(`
    {
      "cached_libelle": "🦄 libelle",
      "cached_nom_complet": null,
      "id": 1,
      "siret": "🦄 siret",
    }
  `);
});

test("throws NotFoundError when organization not found", async () => {
  const get_organization_by_id = GetOrganizationById(pg, {
    columns: { id: true },
  });

  await expect(get_organization_by_id(42)).rejects.toThrow(NotFoundError);
});
