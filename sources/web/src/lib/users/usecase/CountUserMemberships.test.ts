//

import { create_cactus_organization } from "@~/identite-proconnect/database/seed/captus";
import {
  create_pink_diamond_user,
  create_unicorn_organization,
} from "@~/identite-proconnect/database/seed/unicorn";
import {
  add_user_to_organization,
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/database/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { CountUserMemberships } from "./CountUserMemberships";

//

beforeAll(migrate);
beforeEach(empty_database);

const count_user_merbership = CountUserMemberships({ pg });

//

test("returns no membership", async () => {
  const pink_diamond_user_id = await create_pink_diamond_user(pg);

  const memberships = await count_user_merbership(pink_diamond_user_id);

  expect(memberships).toBe(0);
});

test("returns two memberships", async () => {
  const pink_diamond_user_id = await create_pink_diamond_user(pg);

  const unicorn_organization_id = await create_unicorn_organization(pg);
  await add_user_to_organization({
    organization_id: unicorn_organization_id,
    user_id: pink_diamond_user_id,
    verification_type: "domain_not_verified_yet",
  });
  const cactus_organization_id = await create_cactus_organization(pg);
  await add_user_to_organization({
    organization_id: cactus_organization_id,
    user_id: pink_diamond_user_id,
    verification_type: "domain_not_verified_yet",
  });

  const memberships = await count_user_merbership(pink_diamond_user_id);

  expect(memberships).toBe(2);
});
