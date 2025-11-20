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
import { beforeAll, expect, setSystemTime, test } from "bun:test";
import { GetMember } from "./GetMember";

//

beforeAll(migrate);
beforeAll(empty_database);

beforeAll(() => {
  setSystemTime(new Date("2222-01-01T00:00:00.000Z"));
});

//

test("get an organization member", async () => {
  const organization_id = await create_unicorn_organization(pg);
  const user_id = await create_adora_pony_user(pg);
  await pg.insert(schema.users_organizations).values({
    organization_id,
    user_id,
  });

  const get_member = GetMember({
    pg,
    columns: {
      is_external: true,
      organization_id: true,
      user_id: true,
    },
  });
  const organization = await get_member({ organization_id, user_id });

  expect(organization).toEqual({
    is_external: false,
    organization_id,
    user_id,
  });
});
