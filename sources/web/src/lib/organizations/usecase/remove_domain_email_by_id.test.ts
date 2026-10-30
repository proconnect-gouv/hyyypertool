//

import { schema } from "@~/identite-proconnect/database";
import { create_unicorn_organization } from "@~/identite-proconnect/database/seed/unicorn";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/database/testing";
import { EmailDomainVerificationEnum } from "@~/identite-proconnect/types";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { remove_domain_email_by_id } from "./remove_domain_email_by_id";

//

beforeAll(migrate);
beforeEach(empty_database);

const deps = { pg, sub: "moderator-sub" };

//

test("removes the domain and journals it as the moderator", async () => {
  const organization_id = await create_unicorn_organization(pg);
  const [{ domain_id } = { domain_id: NaN }] = await pg
    .insert(schema.email_domains)
    .values({
      domain: "rainbow.xyz",
      organization_id,
      verification_type: EmailDomainVerificationEnum.enum.not_verified_yet,
    })
    .returning({ domain_id: schema.email_domains.id });

  expect(await remove_domain_email_by_id(deps, domain_id)).toEqual({
    kind: "domain_removed",
  });

  expect(
    await pg.query.email_domains.findFirst({
      columns: { id: true },
      where: (table, { eq }) => eq(table.id, domain_id),
    }),
  ).toBeUndefined();
  expect(await pg.query.activity_logs.findMany()).toMatchObject([
    {
      action: "domain.removed",
      actor_ref: "moderator-sub",
      actor_type: "moderator",
      app: "hyyypertool",
      context: {
        inputs: { domain: "rainbow.xyz" },
        outcome: {
          email_domain_id: domain_id,
          previous_verification_type:
            EmailDomainVerificationEnum.enum.not_verified_yet,
        },
      },
      organization_id,
      user_id: null,
    },
  ]);
});

test("an unknown domain id removes nothing and journals nothing", async () => {
  expect(await remove_domain_email_by_id(deps, 999)).toEqual({
    kind: "domain_not_found",
  });
  expect(await pg.query.activity_logs.findMany()).toEqual([]);
});
