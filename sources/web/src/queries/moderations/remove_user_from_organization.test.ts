//

import { schema } from "@~/identite-proconnect/database";
import {
  create_adora_pony_user,
  create_unicorn_organization,
} from "@~/identite-proconnect/database/seed/unicorn";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/database/testing";
import { beforeAll, beforeEach, expect, setSystemTime, test } from "bun:test";
import { remove_user_from_organization } from "./remove_user_from_organization";

//

beforeAll(migrate);
beforeEach(empty_database);

beforeAll(() => {
  setSystemTime(new Date("2222-01-01T00:00:00.000Z"));
});

//

test("remove adora from unicorn organization", async () => {
  const unicorn_organization_id = await create_unicorn_organization(pg);
  const adora_pony_user_id = await create_adora_pony_user(pg);

  await pg.insert(schema.users_organizations).values({
    organization_id: unicorn_organization_id,
    user_id: adora_pony_user_id,
    verification_type: "domain_not_verified_yet",
  });

  const response = await remove_user_from_organization(pg, {
    organization_id: unicorn_organization_id,
    user_id: adora_pony_user_id,
  });

  expect(response).toMatchInlineSnapshot(`
    {
      "affectedRows": 1,
      "command": "DELETE",
      "fields": [],
      "rowCount": 1,
      "rows": [],
    }
  `);
});

test("do nothing if adora is not a unicorn member", async () => {
  const unicorn_organization_id = await create_unicorn_organization(pg);
  const adora_pony_user_id = await create_adora_pony_user(pg);

  const response = await remove_user_from_organization(pg, {
    organization_id: unicorn_organization_id,
    user_id: adora_pony_user_id,
  });

  expect(response).toMatchInlineSnapshot(`
    {
      "affectedRows": 0,
      "command": "DELETE",
      "fields": [],
      "rowCount": 0,
      "rows": [],
    }
  `);
});
