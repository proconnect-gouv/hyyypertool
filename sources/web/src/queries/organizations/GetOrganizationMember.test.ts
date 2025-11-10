//

import {
  create_adora_pony_user,
  create_unicorn_organization,
} from "@~/identite-proconnect/database/seed/unicorn";
import {
  add_user_to_organization,
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { GetOrganizationMember } from "./GetOrganizationMember";

//

beforeAll(migrate);
beforeEach(empty_database);

//

test("get organization member relationship", async () => {
  const organization_id = await create_unicorn_organization(pg);
  const user_id = await create_adora_pony_user(pg);

  // Create a user-organization relationship
  await add_user_to_organization({
    organization_id,
    user_id,
    is_external: false,
  });

  const get_organization_member = GetOrganizationMember(pg);
  const member = await get_organization_member({
    user_id,
    organization_id,
  });

  // Should return the membership info
  expect(member).toEqual({
    is_external: false,
  });
});

test("returns null when no membership exists", async () => {
  const organization_id = await create_unicorn_organization(pg);
  const user_id = await create_adora_pony_user(pg);

  const get_organization_member = GetOrganizationMember(pg);
  const member = await get_organization_member({
    user_id,
    organization_id,
  });

  expect(member).toBeUndefined();
});

test("returns null for non-existent user or organization", async () => {
  const get_organization_member = GetOrganizationMember(pg);
  const member = await get_organization_member({
    user_id: 999999,
    organization_id: 999999,
  });

  expect(member).toBeUndefined();
});
