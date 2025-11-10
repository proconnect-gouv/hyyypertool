//

import {
  create_pink_diamond_user,
  create_unicorn_organization,
} from "@~/identite-proconnect/database/seed/unicorn";
import {
  add_user_to_organization,
  migrate,
  pg,
} from "@~/identite-proconnect/testing";
import { beforeAll, expect, test } from "bun:test";
import { CountGmailMembers } from "./CountGmailMembers";

//

beforeAll(migrate);

//

test("counts gmail members for organization", async () => {
  const organization_id = await create_unicorn_organization(pg);
  const user_id = await create_pink_diamond_user(pg);
  await add_user_to_organization({ organization_id, user_id });

  const count_gmail_members = CountGmailMembers(pg);
  const result = await count_gmail_members({
    domain: "@gmail.com",
    siret: "🦄 siret",
  });

  expect(result).toMatchInlineSnapshot(`[]`);
});
