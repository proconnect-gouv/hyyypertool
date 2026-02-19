//

import type { Pagination } from "@~/core/schema";
import type { IdentiteProconnectPgDatabase } from "@~/identite-proconnect/database";
import { schema } from "@~/identite-proconnect/database";
import { EmailDomainVerificationTypes } from "@~/identite-proconnect/types";
import { and, asc, count as drizzle_count, eq } from "drizzle-orm";

//

export async function get_organizations_by_user_id(
  pg: IdentiteProconnectPgDatabase,
  {
    user_id,
    pagination = { page: 0, page_size: 10 },
  }: {
    user_id: number;
    pagination?: Pagination;
  },
) {
  const { page, page_size: take } = pagination;

  const where = and(eq(schema.users_organizations.user_id, user_id));

  return pg.transaction(async function organization_with_count(tx) {
    const users_organizations = await tx.query.users_organizations.findMany({
      columns: {
        verification_type: true,
      },
      limit: take,
      offset: page * take,
      orderBy: asc(schema.organizations.created_at),
      where,
      with: {
        organization: {
          columns: {
            cached_code_officiel_geographique: true,
            cached_libelle: true,
            created_at: true,
            id: true,
            siret: true,
          },
          with: {
            email_domains: {
              columns: { domain: true },
              where: eq(
                schema.email_domains.verification_type,
                EmailDomainVerificationTypes.enum.verified,
              ),
            },
          },
        },
      },
    });
    const organizations = users_organizations.map(
      ({ organization, verification_type }) => ({
        ...organization,
        verification_type,
      }),
    );
    const [{ value: count } = { value: NaN }] = await tx
      .select({ value: drizzle_count() })
      .from(schema.organizations)
      .innerJoin(
        schema.users_organizations,
        eq(schema.organizations.id, schema.users_organizations.organization_id),
      )
      .where(where);

    return { organizations, count };
  });
}
