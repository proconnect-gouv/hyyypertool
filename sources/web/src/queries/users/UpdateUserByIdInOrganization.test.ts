//

import { schema } from "@~/identite-proconnect.database";
import {
  create_adora_pony_user,
  create_unicorn_organization,
} from "@~/identite-proconnect.database/seed/unicorn";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect.database/testing";
import { beforeAll, beforeEach, expect, setSystemTime, test } from "bun:test";
import { UpdateUserByIdInOrganization } from "./UpdateUserByIdInOrganization";

//

beforeAll(migrate);
beforeEach(empty_database);

beforeAll(() => {
  setSystemTime(new Date("2222-01-01T00:00:00.000Z"));
});

//

test("updates user verification type in organization", async () => {
  const organization_id = await create_unicorn_organization(pg);
  const user_id = await create_adora_pony_user(pg);

  // Create user-organization relationship first
  await pg.insert(schema.users_organizations).values({
    organization_id,
    user_id,
    is_external: false,
  });

  setSystemTime(new Date("2222-01-11T00:00:00.000Z"));

  const update_user_by_id_in_organization = UpdateUserByIdInOrganization({
    pg,
  });

  await update_user_by_id_in_organization(
    { organization_id, user_id },
    { verification_type: "verified" },
  );

  const result = await pg.query.users_organizations.findFirst({
    where: (table, { and, eq }) =>
      and(
        eq(table.organization_id, organization_id),
        eq(table.user_id, user_id),
      ),
  });

  expect(result).toMatchInlineSnapshot(`
    {
      "created_at": "1970-01-01 00:00:00+00",
      "has_been_greeted": false,
      "is_external": false,
      "needs_official_contact_email_verification": false,
      "official_contact_email_verification_sent_at": null,
      "official_contact_email_verification_token": null,
      "organization_id": 1,
      "updated_at": "2222-01-11 00:00:00+00",
      "user_id": 1,
      "verification_type": "verified",
      "verified_at": null,
    }
  `);
});

test("updates multiple fields in user organization", async () => {
  const organization_id = await create_unicorn_organization(pg);
  const user_id = await create_adora_pony_user(pg);

  // Create user-organization relationship first
  await pg.insert(schema.users_organizations).values({
    organization_id,
    user_id,
    is_external: false,
  });

  setSystemTime(new Date("2222-01-11T00:00:00.000Z"));

  const update_user_by_id_in_organization = UpdateUserByIdInOrganization({
    pg,
  });

  await update_user_by_id_in_organization(
    { organization_id, user_id },
    {
      verification_type: "external",
      is_external: true,
    },
  );

  const result = await pg.query.users_organizations.findFirst({
    where: (table, { and, eq }) =>
      and(
        eq(table.organization_id, organization_id),
        eq(table.user_id, user_id),
      ),
  });

  expect(result).toMatchInlineSnapshot(`
    {
      "created_at": "1970-01-01 00:00:00+00",
      "has_been_greeted": false,
      "is_external": true,
      "needs_official_contact_email_verification": false,
      "official_contact_email_verification_sent_at": null,
      "official_contact_email_verification_token": null,
      "organization_id": 1,
      "updated_at": "2222-01-11 00:00:00+00",
      "user_id": 1,
      "verification_type": "external",
      "verified_at": null,
    }
  `);
});
