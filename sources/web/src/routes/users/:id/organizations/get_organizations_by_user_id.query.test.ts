//

import {
  create_pink_diamond_user,
  create_unicorn_organization,
} from "@~/identite-proconnect/database/seed/unicorn";
import {
  add_user_to_organization,
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/database/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { get_organizations_by_user_id } from "./get_organizations_by_user_id.query";

//

beforeAll(migrate);
beforeEach(empty_database);

//

test("returns organizations for a user", async () => {
  const organization_id = await create_unicorn_organization(pg);
  const user_id = await create_pink_diamond_user(pg);
  await add_user_to_organization({
    organization_id,
    user_id,
  });

  const result = await get_organizations_by_user_id(pg, { user_id });

  expect(result).toMatchInlineSnapshot(`
    {
      "count": 1,
      "organizations": [
        {
          "cached_code_officiel_geographique": null,
          "cached_libelle": "🦄 libelle",
          "created_at": "1970-01-01T00:00:00+00:00",
          "email_domains": [
            {
              "domain": "unicorn.xyz",
            },
          ],
          "id": 1,
          "siret": "🦄 siret",
          "verification_type": null,
        },
      ],
    }
  `);
});

test("supports pagination", async () => {
  const organization_id = await create_unicorn_organization(pg);
  const user_id = await create_pink_diamond_user(pg);
  await add_user_to_organization({
    organization_id,
    user_id,
  });

  const result = await get_organizations_by_user_id(pg, {
    user_id,
    pagination: { page: 0, page_size: 1 },
  });

  expect(result).toMatchInlineSnapshot(`
    {
      "count": 1,
      "organizations": [
        {
          "cached_code_officiel_geographique": null,
          "cached_libelle": "🦄 libelle",
          "created_at": "1970-01-01T00:00:00+00:00",
          "email_domains": [
            {
              "domain": "unicorn.xyz",
            },
          ],
          "id": 1,
          "siret": "🦄 siret",
          "verification_type": null,
        },
      ],
    }
  `);
});
