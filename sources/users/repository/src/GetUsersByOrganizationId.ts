//

import type { Pagination } from "@~/core/schema";
import {
  schema,
  type IdentiteProconnect_PgDatabase,
} from "@~/identite-proconnect.database";
import { and, desc, count as drizzle_count, eq } from "drizzle-orm";

//

export function GetUsersByOrganizationId(pg: IdentiteProconnect_PgDatabase) {
  return async function get_users_by_organization_id({
    organization_id,
    pagination = { page: 0, page_size: 10 },
  }: {
    organization_id: number;
    pagination?: Pagination;
  }) {
    const { page, page_size: take } = pagination;

    const where = and(
      eq(schema.users_organizations.organization_id, organization_id),
    );

    const { users, count } = await pg.transaction(async (pg_t) => {
      const users = await pg_t
        .select({
          email: schema.users.email,
          family_name: schema.users.family_name,
          given_name: schema.users.given_name,
          id: schema.users.id,
          is_external: schema.users_organizations.is_external,
          job: schema.users.job,
          verification_type: schema.users_organizations.verification_type,
        })
        .from(schema.users)
        .innerJoin(
          schema.users_organizations,
          eq(schema.users.id, schema.users_organizations.user_id),
        )
        .where(where)
        .orderBy(desc(schema.users.created_at), desc(schema.users.id))
        .limit(take)
        .offset(page * take);
      const [{ value: count }] = await pg_t
        .select({ value: drizzle_count() })
        .from(schema.users)
        .innerJoin(
          schema.users_organizations,
          eq(schema.users.id, schema.users_organizations.user_id),
        )
        .where(where);

      return { users, count };
    });

    return { users, count };
  };
}

export type GetUsersByOrganizationIdHandler = ReturnType<
  typeof GetUsersByOrganizationId
>;
export type GetUsersByOrganizationIdDto = Awaited<
  ReturnType<GetUsersByOrganizationIdHandler>
>;
