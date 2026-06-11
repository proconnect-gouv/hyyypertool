//

import {
  create_adora_pony_oidc_connection,
  create_adora_pony_user,
  create_unicorn_oidc_client,
} from "@~/identite-proconnect/database/seed/unicorn";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/database/testing";
import { beforeAll, beforeEach, expect, setSystemTime, test } from "bun:test";
import { get_oidc_clients_by_user_id } from "./get_oidc_clients_by_user_id.query";

//

beforeAll(migrate);
beforeEach(empty_database);
setSystemTime(new Date("2222-01-01T00:00:00.000Z"));

//

test("get adora's oidc connections", async () => {
  const user_id = await create_adora_pony_user(pg);
  await create_unicorn_oidc_client(pg);
  await create_adora_pony_oidc_connection(pg, { sp_name: "🦄 sp" });

  const result = await get_oidc_clients_by_user_id(pg, { user_id });

  expect(result).toMatchInlineSnapshot(`
    {
      "connections": [
        {
          "created_at": "2222-01-01 01:00:00+01",
          "id": 1,
          "oidc_client": {
            "client_id": "🦄 client_id",
            "client_name": "🦄 client_name",
          },
          "organization": null,
          "sp_name": "🦄 sp",
        },
      ],
      "count": 1,
    }
  `);
});

test("returns empty array when user has no connections", async () => {
  const user_id = await create_adora_pony_user(pg);

  const result = await get_oidc_clients_by_user_id(pg, { user_id });

  expect(result).toEqual({ connections: [], count: 0 });
});

test("returns connections ordered by created_at desc", async () => {
  const user_id = await create_adora_pony_user(pg);
  await create_unicorn_oidc_client(pg);
  await create_adora_pony_oidc_connection(pg, {
    created_at: "2020-01-01T00:00:00Z",
    updated_at: "2020-01-01T00:00:00Z",
  });
  await create_adora_pony_oidc_connection(pg, {
    created_at: "2024-06-01T00:00:00Z",
    updated_at: "2024-06-01T00:00:00Z",
  });

  const result = await get_oidc_clients_by_user_id(pg, { user_id });

  expect(result).toMatchInlineSnapshot(`
    {
      "connections": [
        {
          "created_at": "2024-06-01 01:00:00+01",
          "id": 2,
          "oidc_client": {
            "client_id": "🦄 client_id",
            "client_name": "🦄 client_name",
          },
          "organization": null,
          "sp_name": null,
        },
        {
          "created_at": "2020-01-01 01:00:00+01",
          "id": 1,
          "oidc_client": {
            "client_id": "🦄 client_id",
            "client_name": "🦄 client_name",
          },
          "organization": null,
          "sp_name": null,
        },
      ],
      "count": 2,
    }
  `);
});

test("supports pagination", async () => {
  const user_id = await create_adora_pony_user(pg);
  await create_unicorn_oidc_client(pg);
  await create_adora_pony_oidc_connection(pg, {
    created_at: "2020-01-01T00:00:00Z",
    updated_at: "2020-01-01T00:00:00Z",
  });
  await create_adora_pony_oidc_connection(pg, {
    created_at: "2024-06-01T00:00:00Z",
    updated_at: "2024-06-01T00:00:00Z",
  });

  const result = await get_oidc_clients_by_user_id(pg, {
    user_id,
    pagination: { page: 1, page_size: 1 },
  });

  expect(result.count).toBe(2);
  expect(result.connections).toMatchInlineSnapshot(`
    [
      {
        "created_at": "2020-01-01 01:00:00+01",
        "id": 1,
        "oidc_client": {
          "client_id": "🦄 client_id",
          "client_name": "🦄 client_name",
        },
        "organization": null,
        "sp_name": null,
      },
    ]
  `);
});
