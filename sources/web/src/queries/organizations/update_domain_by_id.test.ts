//

import { create_unicorn_organization } from "@~/identite-proconnect/database/seed/unicorn";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/database/testing";
import { beforeAll, expect, setSystemTime, test } from "bun:test";
import { update_domain_by_id } from "./update_domain_by_id";
//

beforeAll(migrate);
beforeAll(empty_database);

beforeAll(() => {
  setSystemTime(new Date("2222-01-01T00:00:00.000Z"));
});

//

test("should update nothing", async () => {
  const unicorn_organization_id = await create_unicorn_organization(pg);
  const { id: domain_id } = await pg.query.email_domains
    .findFirst({
      where: (table, { eq }) =>
        eq(table.organization_id, unicorn_organization_id),
    })
    .then((domain) => domain!);

  setSystemTime(new Date("2222-01-02T00:00:00.000Z"));
  await update_domain_by_id(pg, domain_id, {});

  expect(
    await pg.query.email_domains.findFirst({
      where: (table, { eq }) => eq(table.id, domain_id),
    }),
  ).toMatchInlineSnapshot(`
    {
      "can_be_suggested": true,
      "created_at": "2222-01-01 01:00:00+01",
      "domain": "unicorn.xyz",
      "id": 1,
      "organization_id": 1,
      "updated_at": "2222-01-02 01:00:00+01",
      "verification_type": "verified",
      "verified_at": null,
    }
  `);
});
