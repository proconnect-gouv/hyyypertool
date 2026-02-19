//

import { mostUsedFreeEmailDomains as most_used_free_email_domains } from "@proconnect-gouv/proconnect.core/data";
import type { Pagination } from "@~/core/schema";
import {
  schema,
  type IdentiteProconnectPgDatabase,
} from "@~/identite-proconnect/database";
import { EmailDomainVerificationTypes } from "@~/identite-proconnect/types";
import {
  and,
  asc,
  count as drizzle_count,
  eq,
  ilike,
  inArray,
  isNotNull,
  isNull,
  not,
  or,
  sql,
} from "drizzle-orm";
import { readFile } from "fs/promises";
import { fileURLToPath } from "node:url";

//

const disposable_free_email_domain = (
  await readFile(
    fileURLToPath(
      import.meta.resolve("is-disposable-email-domain/data/free.txt"),
    ),
    "utf-8",
  )
).split("\n");

//

export async function get_unverified_domains(
  pg: IdentiteProconnectPgDatabase,
  {
    pagination = { page: 0, page_size: 10 },
    search,
  }: {
    pagination?: Pagination;
    search?: string;
  },
) {
  const where_active_organization = or(
    isNull(schema.organizations.cached_est_active),
    eq(schema.organizations.cached_est_active, true),
  );

  const where_authorized_email_domains = and(
    eq(
      schema.email_domains.verification_type,
      EmailDomainVerificationTypes.enum.not_verified_yet,
    ),
  )!;

  // Inspired by https://github.com/numerique-gouv/identite-proconnect/blob/f56812b300edcb6ef444ac07f91c1e8dbf411967/src/services/organization.ts#L9-L26
  const where_unipersonnelle = and(
    isNotNull(schema.organizations.cached_libelle_categorie_juridique),
    inArray(schema.organizations.cached_libelle_categorie_juridique, [
      "Entrepreneur individuel",
      "SAS, société par actions simplifiée",
      "Société à responsabilité limitée (sans autre indication)",
    ]),
    or(
      isNull(schema.organizations.cached_tranche_effectifs),
      inArray(schema.organizations.cached_tranche_effectifs, [
        "NN",
        "00",
        "01",
      ]),
    ),
  )!;

  const free_domains_array_literal = `ARRAY[${most_used_free_email_domains
    .concat(disposable_free_email_domain)
    .map((d) => `'${d.replace(/'/g, "''")}'`)
    .join(",")}]`;

  //

  const { page, page_size: take } = pagination;
  const search_where = search
    ? or(
        ilike(schema.email_domains.domain, `%${search}%`),
        ilike(schema.organizations.cached_libelle, `%${search}%`),
        ilike(schema.organizations.siret, `%${search}%`),
      )
    : undefined;

  return pg.transaction(async function moderation_count(tx) {
    await tx.execute(
      sql`CREATE TEMP TABLE _free_domains (domain text PRIMARY KEY) ON COMMIT DROP`,
    );

    await tx.execute(
      sql.raw(
        `INSERT INTO _free_domains (domain) SELECT unnest(${free_domains_array_literal}::text[]) ON CONFLICT DO NOTHING`,
      ),
    );

    const where_not_free_domain = sql`NOT EXISTS (SELECT 1 FROM _free_domains fd WHERE fd.domain = ${schema.email_domains.domain})`;

    const where = and(
      search_where,
      where_active_organization,
      where_authorized_email_domains,
      not(where_unipersonnelle),
      where_not_free_domain,
    );

    const member_count = tx
      .select({
        count: drizzle_count(schema.users_organizations.user_id).as("count"),
        organization_id: schema.users_organizations.organization_id,
      })
      .from(schema.users_organizations)
      .groupBy(schema.users_organizations.organization_id)
      .as("member_count");

    const domains = await tx
      .select({
        domain: schema.email_domains.domain,
        id: schema.email_domains.id,
        organization: {
          cached_libelle: schema.organizations.cached_libelle,
          created_at: schema.organizations.created_at,
          id: schema.organizations.id,
          siret: schema.organizations.siret,
        },
      })
      .from(schema.email_domains)
      .innerJoin(
        schema.organizations,
        eq(schema.email_domains.organization_id, schema.organizations.id),
      )
      .leftJoin(
        member_count,
        eq(schema.email_domains.organization_id, member_count.organization_id),
      )
      .where(where)
      .offset(page * take)
      .limit(take)
      .orderBy(
        asc(member_count.count),
        asc(schema.email_domains.domain),
        asc(schema.organizations.id),
      );

    const [{ value: count } = { value: NaN }] = await tx
      .select({ value: drizzle_count() })
      .from(schema.email_domains)
      .innerJoin(
        schema.organizations,
        eq(schema.email_domains.organization_id, schema.organizations.id),
      )
      .where(where);
    return { domains, count };
  });
}
