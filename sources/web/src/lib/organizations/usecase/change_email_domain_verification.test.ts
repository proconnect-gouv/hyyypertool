//

import { NotFoundError } from "#src/errors";
import { schema } from "@~/identite-proconnect/database";
import {
  create_adora_pony_user,
  create_pink_diamond_user,
  create_unicorn_organization,
} from "@~/identite-proconnect/database/seed/unicorn";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/database/testing";
import {
  EmailDomainVerificationEnum,
  LinkEnum,
} from "@~/identite-proconnect/types";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { asc } from "drizzle-orm";
import { change_email_domain_verification } from "./change_email_domain_verification";

//

beforeAll(migrate);
beforeEach(empty_database);

const deps = { pg, sub: "moderator-sub" };

async function insert_pending_domain(organization_id: number) {
  await pg.insert(schema.email_domains).values({
    domain: "unicorn.xyz",
    organization_id,
    verification_type: EmailDomainVerificationEnum.enum.not_verified_yet,
  });
}

//

test("refused replaces the domain states with refused and leaves members untouched", async () => {
  const organization_id = await create_unicorn_organization(pg);
  const user_id = await create_adora_pony_user(pg);
  await pg.insert(schema.users_organizations).values({
    organization_id,
    user_id,
    verification_type: LinkEnum.enum.domain_not_verified_yet,
  });
  await insert_pending_domain(organization_id);

  expect(
    await change_email_domain_verification(deps, {
      domain: "unicorn.xyz",
      organization_id,
      verification_type: "refused",
    }),
  ).toEqual({ kind: "domain_refused" });

  expect(
    await pg.query.email_domains.findMany({
      where: (table, { eq }) => eq(table.organization_id, organization_id),
    }),
  ).toMatchObject([
    {
      domain: "unicorn.xyz",
      organization_id,
      verification_type: EmailDomainVerificationEnum.enum.refused,
      verified_at: null,
    },
  ]);
  expect(
    await pg.query.users_organizations.findFirst({
      where: (table, { eq }) => eq(table.user_id, user_id),
    }),
  ).toMatchObject({
    verification_type: LinkEnum.enum.domain_not_verified_yet,
  });
  expect(await pg.query.activity_logs.findMany()).toMatchObject([
    {
      action: "domain.refused",
      actor_ref: "moderator-sub",
      actor_type: "moderator",
      app: "hyyypertool",
      context: {
        inputs: { domain: "unicorn.xyz", verification_type: "refused" },
        outcome: {
          email_domain_id: expect.any(Number),
          replaced_verification_types: expect.arrayContaining([
            EmailDomainVerificationEnum.enum.not_verified_yet,
            EmailDomainVerificationEnum.enum.verified,
          ]),
        },
      },
      moderation_id: null,
      organization_id,
      user_id: null,
    },
  ]);
});

test("verified replaces the domain states and promotes matching members", async () => {
  const organization_id = await create_unicorn_organization(pg);
  const adora_pony_user_id = await create_adora_pony_user(pg);
  const pink_diamond_user_id = await create_pink_diamond_user(pg);
  await pg.insert(schema.users_organizations).values([
    {
      organization_id,
      user_id: adora_pony_user_id,
      verification_type: LinkEnum.enum.domain_not_verified_yet,
    },
    {
      organization_id,
      user_id: pink_diamond_user_id,
      verification_type: LinkEnum.enum.proof_received,
    },
  ]);
  await insert_pending_domain(organization_id);

  expect(
    await change_email_domain_verification(deps, {
      domain: "unicorn.xyz",
      organization_id,
      verification_type: "verified",
    }),
  ).toMatchObject({
    email_domain: {
      verification_type: EmailDomainVerificationEnum.enum.verified,
    },
    kind: "domain_verified",
    promoted_members: [
      {
        previous_verification_type: LinkEnum.enum.domain_not_verified_yet,
        user_id: adora_pony_user_id,
      },
    ],
    replaced_verification_types: expect.arrayContaining([
      EmailDomainVerificationEnum.enum.not_verified_yet,
      EmailDomainVerificationEnum.enum.verified,
    ]),
  });

  expect(
    await pg.query.email_domains.findMany({
      where: (table, { eq }) => eq(table.organization_id, organization_id),
    }),
  ).toMatchObject([
    {
      domain: "unicorn.xyz",
      organization_id,
      verification_type: EmailDomainVerificationEnum.enum.verified,
    },
  ]);
  expect(
    await pg.query.users_organizations.findMany({
      where: (table, { eq }) => eq(table.organization_id, organization_id),
      orderBy: asc(schema.users_organizations.user_id),
    }),
  ).toMatchObject([
    { user_id: adora_pony_user_id, verification_type: LinkEnum.enum.domain },
    {
      user_id: pink_diamond_user_id,
      verification_type: LinkEnum.enum.proof_received,
    },
  ]);
  expect(
    await pg.query.activity_logs.findMany({ orderBy: (table) => table.id }),
  ).toMatchObject([
    {
      action: "domain.verified",
      actor_ref: "moderator-sub",
      actor_type: "moderator",
      app: "hyyypertool",
      id: 1,
      organization_id,
    },
    {
      action: "member.promoted",
      actor_ref: "domain.promote_members",
      actor_type: "app",
      app: "hyyypertool",
      cause_activity_id: 1,
      organization_id,
      user_id: adora_pony_user_id,
    },
  ]);
});

test("throws NotFoundError when the organization does not exist", async () => {
  await expect(
    change_email_domain_verification(deps, {
      domain: "unicorn.xyz",
      organization_id: 999,
      verification_type: "verified",
    }),
  ).rejects.toThrow(NotFoundError);
});

test("verifies a domain given by domain and organization", async () => {
  const organization_id = await create_unicorn_organization(pg);

  expect(
    await change_email_domain_verification(deps, {
      domain: "rainbow.xyz",
      organization_id,
      verification_type: "external",
    }),
  ).toMatchObject({ kind: "domain_verified" });

  expect(
    await pg.query.email_domains.findFirst({
      where: (table, { and, eq }) =>
        and(
          eq(table.domain, "rainbow.xyz"),
          eq(table.organization_id, organization_id),
        ),
    }),
  ).toMatchObject({
    verification_type: EmailDomainVerificationEnum.enum.external,
  });
});
