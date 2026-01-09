//

import type { Pagination } from "@~/core/schema";
import {
  schema,
  type IdentiteProconnectPgDatabase,
} from "@~/identite-proconnect/database";
import { and, desc, count as drizzle_count, eq } from "drizzle-orm";

//

export async function get_users_by_organization(
  pg: IdentiteProconnectPgDatabase,
  {
    organization_id,
    pagination = { page: 0, page_size: 10 },
  }: {
    organization_id: number;
    pagination?: Pagination;
  },
) {
  const { page, page_size: take } = pagination;

  const where = and(
    eq(schema.users_organizations.organization_id, organization_id),
  );

  return pg.transaction(async (pg_t) => {
    const users = await pg_t
      .select({
        created_at: schema.users_organizations.created_at,
        email: schema.users.email,
        family_name: schema.users.family_name,
        given_name: schema.users.given_name,
        id: schema.users.id,
        is_external: schema.users_organizations.is_external,
        job: schema.users.job,
        needs_official_contact_email_verification:
          schema.users_organizations.needs_official_contact_email_verification,
        updated_at: schema.users_organizations.updated_at,
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

    const [{ value: count } = { value: NaN }] = await pg_t
      .select({ value: drizzle_count() })
      .from(schema.users)
      .innerJoin(
        schema.users_organizations,
        eq(schema.users.id, schema.users_organizations.user_id),
      )
      .where(where);

    return { users, count };
  });
}
