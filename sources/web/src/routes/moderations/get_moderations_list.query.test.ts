//

import {
  create_adora_pony_moderation,
  create_adora_pony_user,
  create_unicorn_organization,
} from "@~/identite-proconnect/database/seed/unicorn";
import { empty_database, migrate, pg } from "@~/identite-proconnect/testing";
import { beforeAll, beforeEach, expect, setSystemTime, test } from "bun:test";
import { get_moderations_list } from "./get_moderations_list.query";

//

beforeAll(migrate);
beforeEach(empty_database);

beforeAll(() => {
  setSystemTime(new Date("2222-01-01T00:00:00.000Z"));
});

//

test("get moderations list with basic search", async () => {
  await create_unicorn_organization(pg);
  await create_adora_pony_user(pg);
  await create_adora_pony_moderation(pg, {
    type: "non_verified_domain",
  });

  const result = await get_moderations_list(pg, {
    search: {},
  });

  expect(result).toMatchInlineSnapshot(`
    {
      "count": 1,
      "moderations": [
        {
          "created_at": "2222-01-01 00:00:00+00",
          "id": 1,
          "moderated_at": null,
          "organization": {
            "siret": "🦄 siret",
          },
          "type": "non_verified_domain",
          "user": {
            "email": "adora.pony@unicorn.xyz",
            "family_name": "Pony",
            "given_name": "Adora",
          },
        },
      ],
    }
  `);
});

test("filters by email search", async () => {
  await create_unicorn_organization(pg);
  await create_adora_pony_user(pg);
  await create_adora_pony_moderation(pg, { type: "" });

  const result = await get_moderations_list(pg, {
    search: {
      search_email: "adora",
    },
  });

  expect(result).toMatchInlineSnapshot(`
    {
      "count": 1,
      "moderations": [
        {
          "created_at": "2222-01-01 00:00:00+00",
          "id": 1,
          "moderated_at": null,
          "organization": {
            "siret": "🦄 siret",
          },
          "type": "",
          "user": {
            "email": "adora.pony@unicorn.xyz",
            "family_name": "Pony",
            "given_name": "Adora",
          },
        },
      ],
    }
  `);
});

test("filters by siret search", async () => {
  await create_unicorn_organization(pg);
  await create_adora_pony_user(pg);
  await create_adora_pony_moderation(pg, { type: "" });

  const result = await get_moderations_list(pg, {
    search: {
      search_siret: "🦄 siret",
    },
  });

  expect(result).toMatchInlineSnapshot(`
    {
      "count": 1,
      "moderations": [
        {
          "created_at": "2222-01-01 00:00:00+00",
          "id": 1,
          "moderated_at": null,
          "organization": {
            "siret": "🦄 siret",
          },
          "type": "",
          "user": {
            "email": "adora.pony@unicorn.xyz",
            "family_name": "Pony",
            "given_name": "Adora",
          },
        },
      ],
    }
  `);
});

test("excludes archived moderations by default", async () => {
  await create_unicorn_organization(pg);
  await create_adora_pony_user(pg);

  // Create a moderated (archived) moderation
  await create_adora_pony_moderation(pg, {
    type: "",
    moderated_at: "2222-01-01T00:00:00.000Z",
  });

  // Create an unmoderated moderation
  await create_adora_pony_moderation(pg, { type: "" });

  const result = await get_moderations_list(pg, {
    search: {},
  });

  expect(result).toMatchInlineSnapshot(`
    {
      "count": 1,
      "moderations": [
        {
          "created_at": "2222-01-01 00:00:00+00",
          "id": 2,
          "moderated_at": null,
          "organization": {
            "siret": "🦄 siret",
          },
          "type": "",
          "user": {
            "email": "adora.pony@unicorn.xyz",
            "family_name": "Pony",
            "given_name": "Adora",
          },
        },
      ],
    }
  `);
});

test("includes archived moderations when show_archived is true", async () => {
  await create_unicorn_organization(pg);
  await create_adora_pony_user(pg);

  await create_adora_pony_moderation(pg, {
    type: "",
    moderated_at: "2222-01-01T00:00:00.000Z",
  });

  const result = await get_moderations_list(pg, {
    search: {
      processed_requests: true,
    },
  });

  expect(result).toMatchInlineSnapshot(`
    {
      "count": 1,
      "moderations": [
        {
          "created_at": "2222-01-01 00:00:00+00",
          "id": 1,
          "moderated_at": "2222-01-01 00:00:00+00",
          "organization": {
            "siret": "🦄 siret",
          },
          "type": "",
          "user": {
            "email": "adora.pony@unicorn.xyz",
            "family_name": "Pony",
            "given_name": "Adora",
          },
        },
      ],
    }
  `);
});

test("supports pagination", async () => {
  await create_unicorn_organization(pg);
  await create_adora_pony_user(pg);

  // Create multiple moderations
  await create_adora_pony_moderation(pg, { type: "type_1" });
  await create_adora_pony_moderation(pg, { type: "type_2" });
  await create_adora_pony_moderation(pg, { type: "type_3" });

  // Test first page
  const page1 = await get_moderations_list(pg, {
    search: {},
    pagination: { page: 0, page_size: 2 },
  });

  expect(page1).toMatchInlineSnapshot(`
    {
      "count": 3,
      "moderations": [
        {
          "created_at": "2222-01-01 00:00:00+00",
          "id": 1,
          "moderated_at": null,
          "organization": {
            "siret": "🦄 siret",
          },
          "type": "type_1",
          "user": {
            "email": "adora.pony@unicorn.xyz",
            "family_name": "Pony",
            "given_name": "Adora",
          },
        },
        {
          "created_at": "2222-01-01 00:00:00+00",
          "id": 2,
          "moderated_at": null,
          "organization": {
            "siret": "🦄 siret",
          },
          "type": "type_2",
          "user": {
            "email": "adora.pony@unicorn.xyz",
            "family_name": "Pony",
            "given_name": "Adora",
          },
        },
      ],
    }
  `);

  // Test second page
  const page2 = await get_moderations_list(pg, {
    search: {},
    pagination: { page: 1, page_size: 2 },
  });

  expect(page2).toMatchInlineSnapshot(`
    {
      "count": 3,
      "moderations": [
        {
          "created_at": "2222-01-01 00:00:00+00",
          "id": 3,
          "moderated_at": null,
          "organization": {
            "siret": "🦄 siret",
          },
          "type": "type_3",
          "user": {
            "email": "adora.pony@unicorn.xyz",
            "family_name": "Pony",
            "given_name": "Adora",
          },
        },
      ],
    }
  `);
});
