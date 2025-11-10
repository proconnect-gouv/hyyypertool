//

import { schema } from "@~/identite-proconnect/database";
import {
  create_adora_pony_user,
  create_pink_diamond_user,
  create_red_diamond_user,
} from "@~/identite-proconnect/database/seed/unicorn";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/testing";
import { beforeAll, beforeEach, expect, setSystemTime, test } from "bun:test";
import { eq } from "drizzle-orm";
import { GetUsersList } from "./GetUsersList";

//

beforeAll(migrate);
beforeEach(empty_database);

beforeAll(() => {
  setSystemTime(new Date("2222-01-01T00:00:00.000Z"));
});

test("returns paginated users list with default pagination", async () => {
  await create_adora_pony_user(pg);

  const get_users_list = GetUsersList(pg);
  const result = await get_users_list({});

  expect(result).toMatchInlineSnapshot(`
    {
      "count": 1,
      "users": [
        {
          "created_at": "2222-01-01 00:00:00+00",
          "email": "adora.pony@unicorn.xyz",
          "email_verified_at": null,
          "family_name": "Pony",
          "given_name": "Adora",
          "id": 1,
          "last_sign_in_at": null,
        },
      ],
    }
  `);
});

test("returns empty list when no users", async () => {
  const get_users_list = GetUsersList(pg);
  const result = await get_users_list({});

  expect(result).toMatchInlineSnapshot(`
    {
      "count": 0,
      "users": [],
    }
  `);
});

test("filters users by search term in email", async () => {
  await create_adora_pony_user(pg);
  await create_pink_diamond_user(pg);
  await create_red_diamond_user(pg);

  const get_users_list = GetUsersList(pg);
  const result = await get_users_list({ search: "pony" });

  expect(result).toMatchInlineSnapshot(`
    {
      "count": 1,
      "users": [
        {
          "created_at": "2222-01-01 00:00:00+00",
          "email": "adora.pony@unicorn.xyz",
          "email_verified_at": null,
          "family_name": "Pony",
          "given_name": "Adora",
          "id": 1,
          "last_sign_in_at": null,
        },
      ],
    }
  `);
});

test("filters users by search term in family name", async () => {
  await create_adora_pony_user(pg);
  await create_pink_diamond_user(pg);
  await create_red_diamond_user(pg);

  const get_users_list = GetUsersList(pg);
  const result = await get_users_list({ search: "Pony" });

  expect(result).toMatchInlineSnapshot(`
    {
      "count": 1,
      "users": [
        {
          "created_at": "2222-01-01 00:00:00+00",
          "email": "adora.pony@unicorn.xyz",
          "email_verified_at": null,
          "family_name": "Pony",
          "given_name": "Adora",
          "id": 1,
          "last_sign_in_at": null,
        },
      ],
    }
  `);
});

test("filters users by search term in given name", async () => {
  await create_adora_pony_user(pg);
  await create_pink_diamond_user(pg);
  await create_red_diamond_user(pg);

  const get_users_list = GetUsersList(pg);
  const result = await get_users_list({ search: "Adora" });

  expect(result).toMatchInlineSnapshot(`
    {
      "count": 1,
      "users": [
        {
          "created_at": "2222-01-01 00:00:00+00",
          "email": "adora.pony@unicorn.xyz",
          "email_verified_at": null,
          "family_name": "Pony",
          "given_name": "Adora",
          "id": 1,
          "last_sign_in_at": null,
        },
      ],
    }
  `);
});

test("respects pagination parameters", async () => {
  // Create 3 users
  await create_adora_pony_user(pg);
  await create_pink_diamond_user(pg);
  await create_red_diamond_user(pg);

  const get_users_list = GetUsersList(pg);

  // Test first page
  const firstPage = await get_users_list({
    pagination: { page: 0, page_size: 2 },
  });
  expect(firstPage).toMatchInlineSnapshot(`
    {
      "count": 3,
      "users": [
        {
          "created_at": "2222-01-01 00:00:00+00",
          "email": "adora.pony@unicorn.xyz",
          "email_verified_at": null,
          "family_name": "Pony",
          "given_name": "Adora",
          "id": 1,
          "last_sign_in_at": null,
        },
        {
          "created_at": "2222-01-01 00:00:00+00",
          "email": "pink.diamond@unicorn.xyz",
          "email_verified_at": null,
          "family_name": "Diamond",
          "given_name": "Pink",
          "id": 2,
          "last_sign_in_at": null,
        },
      ],
    }
  `);

  // Test second page
  const secondPage = await get_users_list({
    pagination: { page: 1, page_size: 2 },
  });
  expect(secondPage).toMatchInlineSnapshot(`
    {
      "count": 3,
      "users": [
        {
          "created_at": "2222-01-01 00:00:00+00",
          "email": "red.diamond@unicorn.xyz",
          "email_verified_at": null,
          "family_name": "Diamond",
          "given_name": "Red",
          "id": 3,
          "last_sign_in_at": null,
        },
      ],
    }
  `);
});

test("orders users by created_at descending", async () => {
  await create_adora_pony_user(pg);
  await create_pink_diamond_user(pg);

  setSystemTime(new Date("2222-02-01T00:00:00.000Z"));

  // Create second user (will have later created_at)
  await pg
    .update(schema.users)
    .set({
      email: "second@example.com",
      family_name: "Second",
      given_name: "User",
      created_at: new Date().toISOString(),
    })
    .where(eq(schema.users.id, 1))
    .returning({ id: schema.users.id });

  const get_users_list = GetUsersList(pg);
  const result = await get_users_list({});

  expect(result).toMatchInlineSnapshot(`
    {
      "count": 2,
      "users": [
        {
          "created_at": "2222-02-01 00:00:00+00",
          "email": "second@example.com",
          "email_verified_at": null,
          "family_name": "Second",
          "given_name": "User",
          "id": 1,
          "last_sign_in_at": null,
        },
        {
          "created_at": "2222-01-01 00:00:00+00",
          "email": "pink.diamond@unicorn.xyz",
          "email_verified_at": null,
          "family_name": "Diamond",
          "given_name": "Pink",
          "id": 2,
          "last_sign_in_at": null,
        },
      ],
    }
  `);
});
