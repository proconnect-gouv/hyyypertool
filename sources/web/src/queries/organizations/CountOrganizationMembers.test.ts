//

import {
  create_pink_diamond_user,
  create_unicorn_organization,
} from "@~/identite-proconnect/database/seed/unicorn";
import {
  add_user_to_organization,
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { CountOrganizationMembers } from "./CountOrganizationMembers";

//

beforeAll(migrate);
beforeEach(empty_database);

//

test("counts organization members", async () => {
  const organization_id = await create_unicorn_organization(pg);
  const user_id = await create_pink_diamond_user(pg);
  await add_user_to_organization({ organization_id, user_id });

  const count_organization_members = CountOrganizationMembers(pg);
  const count = await count_organization_members({ organization_id });

  expect(count).toMatchInlineSnapshot(`1`);
});

test("returns 0 for organization with no members", async () => {
  const organization_id = await create_unicorn_organization(pg);

  const count_organization_members = CountOrganizationMembers(pg);
  const count = await count_organization_members({ organization_id });

  expect(count).toMatchInlineSnapshot(`0`);
});
