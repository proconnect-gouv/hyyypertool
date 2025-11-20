//

import { create_adora_pony_user } from "@~/identite-proconnect/database/seed/unicorn";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/database/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { GetUserById } from "./GetUserById";

//

beforeAll(migrate);
beforeEach(empty_database);

test("returns user with specified columns", async () => {
  const user_id = await create_adora_pony_user(pg);

  const get_user_by_id = GetUserById({
    columns: {
      id: true,
      email: true,
      given_name: true,
      family_name: true,
    },
  });
  const result = await get_user_by_id(pg, user_id);

  expect(result).toMatchInlineSnapshot(`
    {
      "email": "adora.pony@unicorn.xyz",
      "family_name": "Pony",
      "given_name": "Adora",
      "id": 1,
    }
  `);
});

test("throws NotFoundError when user not found", async () => {
  const get_user_by_id = GetUserById({
    columns: { id: true },
  });

  await expect(get_user_by_id(pg, 42)).rejects.toThrow("User not found.");
});
