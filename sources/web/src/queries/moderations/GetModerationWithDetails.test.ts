//

import {
  create_adora_pony_moderation,
  create_adora_pony_user,
  create_unicorn_organization,
} from "@~/identite-proconnect/database/seed/unicorn";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/testing";
import { beforeAll, expect, setSystemTime, test } from "bun:test";
import { GetModerationWithDetails } from "./GetModerationWithDetails";

//

beforeAll(migrate);
beforeAll(empty_database);

beforeAll(() => {
  setSystemTime(new Date("2222-01-01T00:00:00.000Z"));
});

//

test("get a moderation with full organization and user details", async () => {
  await create_unicorn_organization(pg);
  await create_adora_pony_user(pg);
  const moderation_id = await create_adora_pony_moderation(pg, { type: "" });

  const get_moderation_with_details = GetModerationWithDetails(pg);
  const moderation = await get_moderation_with_details(moderation_id);

  expect(moderation).toMatchInlineSnapshot(`
    {
      "comment": null,
      "created_at": "2222-01-01 00:00:00+00",
      "id": 1,
      "moderated_at": null,
      "moderated_by": null,
      "organization": {
        "cached_activite_principale": null,
        "cached_adresse": null,
        "cached_code_postal": null,
        "cached_est_active": null,
        "cached_etat_administratif": null,
        "cached_libelle": "🦄 libelle",
        "cached_libelle_activite_principale": null,
        "cached_libelle_categorie_juridique": null,
        "cached_libelle_tranche_effectif": null,
        "cached_nom_complet": null,
        "cached_tranche_effectifs": null,
        "created_at": "1970-01-01T00:00:00+00:00",
        "id": 1,
        "siret": "🦄 siret",
        "updated_at": "1970-01-01T00:00:00+00:00",
      },
      "organization_id": 1,
      "ticket_id": null,
      "type": "",
      "user": {
        "created_at": "2222-01-01T00:00:00+00:00",
        "email": "adora.pony@unicorn.xyz",
        "family_name": "Pony",
        "given_name": "Adora",
        "id": 1,
        "job": null,
        "last_sign_in_at": null,
        "phone_number": null,
        "sign_in_count": 0,
      },
      "user_id": 1,
    }
  `);
});

test("throws NotFoundError when moderation does not exist", async () => {
  const get_moderation_with_details = GetModerationWithDetails(pg);

  await expect(get_moderation_with_details(999999)).rejects.toThrow(
    "Moderation not found.",
  );
});
