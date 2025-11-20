//

import {
  create_adora_pony_user,
  create_pink_diamond_user,
  create_red_diamond_user,
  create_unicorn_organization,
} from "@~/identite-proconnect/database/seed/unicorn";
import {
  add_user_to_organization,
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/database/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { SuggestSameUserEmails } from "./SuggestSameUserEmails";

//

beforeAll(migrate);
beforeEach(empty_database);

const suggest_same_user_emails = SuggestSameUserEmails({ pg });

//

test("returns all members", async () => {
  const unicorn_organization_id = await given_unicorn_organization();
  const emails = await suggest_same_user_emails({
    organization_id: unicorn_organization_id,
    family_name: "🧟",
  });

  expect(emails).toEqual([
    "adora.pony@unicorn.xyz",
    "pink.diamond@unicorn.xyz",
    "red.diamond@unicorn.xyz",
  ]);
});

test("returns Diamond members", async () => {
  const unicorn_organization_id = await given_unicorn_organization();
  const emails = await suggest_same_user_emails({
    organization_id: unicorn_organization_id,
    family_name: "Diamond",
  });

  expect(emails).toEqual([
    "pink.diamond@unicorn.xyz",
    "red.diamond@unicorn.xyz",
  ]);
});

//

async function given_unicorn_organization() {
  const unicorn_organization_id = await create_unicorn_organization(pg);
  const adora_pony_user_id = await create_adora_pony_user(pg);
  await add_user_to_organization({
    organization_id: unicorn_organization_id,
    user_id: adora_pony_user_id,
  });
  const pink_diamond_user_id = await create_pink_diamond_user(pg);
  await add_user_to_organization({
    organization_id: unicorn_organization_id,
    user_id: pink_diamond_user_id,
  });
  const red_diamond_user_id = await create_red_diamond_user(pg);
  await add_user_to_organization({
    organization_id: unicorn_organization_id,
    user_id: red_diamond_user_id,
  });
  return unicorn_organization_id;
}
