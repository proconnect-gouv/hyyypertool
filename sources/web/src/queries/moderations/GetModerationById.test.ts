//

import {
  create_adora_pony_moderation,
  create_adora_pony_user,
  create_unicorn_organization,
} from "@~/identite-proconnect.database/seed/unicorn";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect.database/testing";
import { beforeAll, beforeEach, expect, setSystemTime, test } from "bun:test";
import { GetModerationById } from "./GetModerationById";

//

beforeAll(migrate);
beforeEach(empty_database);

beforeAll(() => {
  setSystemTime(new Date("2222-01-01T00:00:00.000Z"));
});

//

test("get a moderation", async () => {
  await create_unicorn_organization(pg);
  await create_adora_pony_user(pg);
  const moderation_id = await create_adora_pony_moderation(pg, { type: "" });

  const get_moderation_by_id = GetModerationById({ pg });
  const moderation = await get_moderation_by_id(moderation_id, {
    columns: {
      id: true,
      created_at: true,
      moderated_at: true,
      user_id: true,
      organization_id: true,
    },
  });

  expect(moderation).toMatchInlineSnapshot(`
    {
      "created_at": "2222-01-01 00:00:00+00",
      "id": 1,
      "moderated_at": null,
      "organization_id": 1,
      "user_id": 1,
    }
  `);
});
