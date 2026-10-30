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
} from "@~/identite-proconnect/database/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { get_moderation_with_user } from "./get_moderation_with_user";

//

beforeAll(migrate);
beforeEach(empty_database);

//

test("get a moderation with minimal fields", async () => {
  await create_unicorn_organization(pg);
  await create_adora_pony_user(pg);
  const moderation_id = await create_adora_pony_moderation(pg, { type: "" });

  const moderation = await get_moderation_with_user(pg, moderation_id);

  expect(moderation).toMatchInlineSnapshot(`
    {
      "comment": null,
      "end_user_reason": "Raison transmise par mail",
      "id": 1,
      "organization_id": 1,
      "ticket_id": null,
      "user": {
        "email": "adora.pony@unicorn.xyz",
      },
      "user_id": 1,
    }
  `);
});

test("throws NotFoundError when moderation does not exist", async () => {
  await expect(get_moderation_with_user(pg, 999999)).rejects.toThrow(
    "Moderation not found.",
  );
});
