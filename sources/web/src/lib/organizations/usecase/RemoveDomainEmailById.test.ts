//

import { schema } from "@~/identite-proconnect/database";
import { create_unicorn_organization } from "@~/identite-proconnect/database/seed/unicorn";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/database/testing";
import { EmailDomainVerificationTypes } from "@~/identite-proconnect/types";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { RemoveDomainEmailById } from "./RemoveDomainEmailById";

//

beforeAll(migrate);
beforeEach(empty_database);

const remove_domain_email_by_id = RemoveDomainEmailById({ pg });

//

test("returns no membership", async () => {
  const organization_id = await create_unicorn_organization(pg);
  const [{ domain_id } = { domain_id: NaN }] = await pg
    .insert(schema.email_domains)
    .values({
      domain: "unicorn.xyz",
      organization_id,
      verification_type: EmailDomainVerificationTypes.enum.not_verified_yet,
    })
    .returning({ domain_id: schema.email_domains.id });

  await remove_domain_email_by_id(domain_id);

  expect(
    await pg.query.email_domains.findFirst({
      columns: { id: true },
      where: (table, { eq }) => eq(table.id, domain_id),
    }),
  ).toBeUndefined();
});
