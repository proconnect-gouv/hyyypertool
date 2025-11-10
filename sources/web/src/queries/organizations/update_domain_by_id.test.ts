//

import { create_unicorn_organization } from "@~/identite-proconnect.database/seed/unicorn";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect.database/testing";
import type { MCP_EmailDomain_Type } from "@~/identite-proconnect.lib/identite-proconnect.d";
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
  ).toEqual({
    id: expect.any(Number),
    organization_id: unicorn_organization_id,
    domain: "unicorn.xyz",
    verification_type: "verified" as MCP_EmailDomain_Type,
    can_be_suggested: true,
    verified_at: null,
    created_at: "2222-01-01 00:00:00+00",
    updated_at: "2222-01-02 00:00:00+00",
  });
});
