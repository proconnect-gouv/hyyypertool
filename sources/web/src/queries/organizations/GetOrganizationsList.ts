//

import type { Pagination } from "@~/core/schema";
import {
  schema,
  type IdentiteProconnectPgDatabase,
} from "@~/identite-proconnect/database";
import { and, desc, count as drizzle_count, ilike, or } from "drizzle-orm";

//

export function GetOrganizationsList(pg: IdentiteProconnectPgDatabase) {
  return async function get_organizations_list({
    search,
    pagination = { page: 0, page_size: 10 },
  }: {
    search?: string;
    pagination?: Pagination;
  }) {
    const { page, page_size: take } = pagination;
    const search_where = search
      ? or(
          ilike(schema.organizations.cached_libelle, `%${search}%`),
          ilike(schema.organizations.siret, `%${search}%`),
        )
      : undefined;

    const where = and(search_where);
    return pg.transaction(async function organization_with_count(tx) {
      const organizations = await tx.query.organizations.findMany({
        columns: {
          cached_code_officiel_geographique: true,
          cached_libelle: true,
          created_at: true,
          id: true,
          siret: true,
        },
        limit: take,
        offset: page * take,
        orderBy: desc(schema.organizations.created_at),
        where,
        with: { email_domains: { columns: { domain: true } } },
      });
      const [{ value: count } = { value: NaN }] = await tx
        .select({ value: drizzle_count() })
        .from(schema.organizations)
        .where(where);
      return { organizations, count };
    });
  };
}

export type GetOrganizationsListHandler = ReturnType<
  typeof GetOrganizationsList
>;
export type GetOrganizationsListDto = Awaited<
  ReturnType<GetOrganizationsListHandler>
>;
