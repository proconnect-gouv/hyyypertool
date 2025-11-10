//

import { schema } from "@~/identite-proconnect.database";
import {
  create_adora_pony_moderation,
  create_adora_pony_user,
  create_pink_diamond_user,
  create_unicorn_organization,
} from "@~/identite-proconnect.database/seed/unicorn";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect.database/testing";
import { beforeAll, beforeEach, expect, setSystemTime, test } from "bun:test";
import { ValidateSimilarModerations } from "./ValidateSimilarModerations";

//

beforeAll(migrate);
beforeEach(empty_database);

beforeAll(() => {
  setSystemTime(new Date("2222-01-01T00:00:00.000Z"));
});

//

export const anais_tailhade: {
  email: string;
  given_name: string;
  usual_name: string;
} = {
  email: "anais.tailhade@omage.gouv.fr",
  given_name: "Anais",
  usual_name: "Tailhade",
};

test("validate similar moderations with verified domain", async () => {
  const organization_id = await create_unicorn_organization(pg);
  await create_adora_pony_user(pg);
  await create_adora_pony_moderation(pg, { type: "1️⃣" });
  const pine_diamond_user_id = await create_pink_diamond_user(pg);

  await pg.insert(schema.moderations).values({
    organization_id,
    user_id: pine_diamond_user_id,
    type: "2️⃣",
  });

  const validate_similar_moderations = ValidateSimilarModerations(pg);

  const validated_moderations = await validate_similar_moderations({
    organization_id,
    domain: "unicorn.xyz",
    domain_verification_type: "verified",
    userinfo: anais_tailhade,
  });

  const result = await pg.query.moderations.findMany({
    columns: { id: true, comment: true, user_id: true },
    where: (table, { inArray }) => inArray(table.id, validated_moderations),
  });

  expect(result).toMatchInlineSnapshot(`
    [
      {
        "comment": "7952342400000 anais.tailhade@omage.gouv.fr | Validé par anais.tailhade@omage.gouv.fr | Raison : "[ProConnect] ✨ Validation automatique - domaine vérifié"",
        "id": 1,
        "user_id": 1,
      },
      {
        "comment": "7952342400000 anais.tailhade@omage.gouv.fr | Validé par anais.tailhade@omage.gouv.fr | Raison : "[ProConnect] ✨ Validation automatique - domaine vérifié"",
        "id": 2,
        "user_id": 2,
      },
    ]
  `);
});

test("validate similar moderations with external domain", async () => {
  const organization_id = await create_unicorn_organization(pg);
  await create_adora_pony_user(pg);
  await create_adora_pony_moderation(pg, { type: "1️⃣" });
  const pine_diamond_user_id = await create_pink_diamond_user(pg);

  await pg.insert(schema.moderations).values({
    organization_id,
    user_id: pine_diamond_user_id,
    type: "2️⃣",
  });

  const validate_similar_moderations = ValidateSimilarModerations(pg);

  const validated_moderations = await validate_similar_moderations({
    organization_id,
    domain: "unicorn.xyz",
    domain_verification_type: "external",
    userinfo: anais_tailhade,
  });

  const result = await pg.query.moderations.findMany({
    columns: { id: true, comment: true, user_id: true },
    where: (table, { inArray }) => inArray(table.id, validated_moderations),
  });

  expect(result).toMatchInlineSnapshot(`
    [
      {
        "comment": "7952342400000 anais.tailhade@omage.gouv.fr | Validé par anais.tailhade@omage.gouv.fr | Raison : "[ProConnect] ✨ Validation automatique - domaine externe vérifié"",
        "id": 1,
        "user_id": 1,
      },
      {
        "comment": "7952342400000 anais.tailhade@omage.gouv.fr | Validé par anais.tailhade@omage.gouv.fr | Raison : "[ProConnect] ✨ Validation automatique - domaine externe vérifié"",
        "id": 2,
        "user_id": 2,
      },
    ]
  `);
});

test("no validation when domain is not verified", async () => {
  const organization_id = await create_unicorn_organization(pg);

  const validate_similar_moderations = ValidateSimilarModerations(pg);

  const validated_moderations = await validate_similar_moderations({
    organization_id,
    domain: "unverified.com",
    domain_verification_type: "external",
    userinfo: anais_tailhade,
  });

  const result = await pg.query.moderations.findMany({
    columns: { id: true, comment: true, user_id: true },
    where: (table, { inArray }) => inArray(table.id, validated_moderations),
  });

  expect(result).toMatchInlineSnapshot(`[]`);
});
