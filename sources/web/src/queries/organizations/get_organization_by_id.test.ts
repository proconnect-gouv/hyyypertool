//

import { NotFoundError } from "#src/errors";
import { create_unicorn_organization } from "@~/identite-proconnect/database/seed/unicorn";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/database/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { get_organization_by_id } from "./get_organization_by_id";

//

beforeAll(migrate);
beforeEach(empty_database);

test("returns organization with partial fields", async () => {
  const organization_id = await create_unicorn_organization(pg);

  const query_get_organization_by_id = get_organization_by_id({
    columns: {
      cached_libelle: true,
      cached_nom_complet: true,
      id: true,
      siret: true,
    },
  });
  const result = await query_get_organization_by_id(pg, organization_id);

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
  const query_get_organization_by_id = get_organization_by_id({
    columns: { id: true },
  });

  await expect(query_get_organization_by_id(pg, 42)).rejects.toThrow(
    NotFoundError,
  );
});
