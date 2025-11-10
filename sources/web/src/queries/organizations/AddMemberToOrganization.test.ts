//

import {
  create_adora_pony_user,
  create_unicorn_organization,
} from "@~/identite-proconnect/database/seed/unicorn";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/testing";
import { beforeAll, beforeEach, expect, setSystemTime, test } from "bun:test";
import { AddMemberToOrganization } from "./AddMemberToOrganization";

//

beforeAll(migrate);
beforeEach(empty_database);

beforeAll(() => {
  setSystemTime(new Date("2222-01-01T00:00:00.000Z"));
});

//

test("adds a member to an organization", async () => {
  const user_id = await create_adora_pony_user(pg);
  const organization_id = await create_unicorn_organization(pg);
  const add_member_to_organization = AddMemberToOrganization(pg);

  const result = await add_member_to_organization({
    user_id,
    organization_id,
    is_external: false,
  });

  expect(result).toMatchInlineSnapshot(`
    {
      "created_at": "2222-01-01 00:00:00+00",
      "has_been_greeted": false,
      "is_external": false,
      "needs_official_contact_email_verification": false,
      "official_contact_email_verification_sent_at": null,
      "official_contact_email_verification_token": null,
      "organization_id": 1,
      "updated_at": "2222-01-01 00:00:00+00",
      "user_id": 1,
      "verification_type": null,
      "verified_at": null,
    }
  `);
});
