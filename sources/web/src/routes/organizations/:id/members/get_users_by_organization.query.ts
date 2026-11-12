//

import type { Pagination } from "#src/schema";
import {
  schema,
  type IdentiteProconnectPgDatabase,
} from "@~/identite-proconnect/database";
import {
  and,
  asc,
  desc,
  count as drizzle_count,
  eq,
  ilike,
  isNotNull,
  or,
} from "drizzle-orm";
import type { Order, Sort } from "./context";

//

const sort_columns = {
  created: schema.users_organizations.created_at,
  email: schema.users.email,
  "family-name": schema.users.family_name,
  "given-name": schema.users.given_name,
  "is-external": schema.users_organizations.is_external,
  job: schema.users.job,
  "verification-type": schema.users_organizations.verification_type,
} satisfies Record<Sort, unknown>;

export async function get_users_by_organization(
  pg: IdentiteProconnectPgDatabase,
  {
    organization_id,
    pagination = { page: 0, page_size: 10 },
    search = "",
    sort,
  }: {
    organization_id: number;
    pagination?: Pagination;
    search?: string;
    sort?: { order: Order; sort: Sort };
  },
) {
  const { page, page_size: take } = pagination;

  const where = and(
    eq(schema.users_organizations.organization_id, organization_id),
    or(
      ilike(schema.users.email, `%${search}%`),
      ilike(schema.users.family_name, `%${search}%`),
      ilike(schema.users.given_name, `%${search}%`),
    ),
  );

  const order_by = sort
    ? (sort.order === "asc" ? asc : desc)(sort_columns[sort.sort])
    : desc(schema.users.created_at);

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
        needs_official_contact_email_verification: isNotNull(
          schema.official_contact_email_verifications.user_id,
        ),
        updated_at: schema.users_organizations.updated_at,
        verification_type: schema.users_organizations.verification_type,
      })
      .from(schema.users)
      .innerJoin(
        schema.users_organizations,
        eq(schema.users.id, schema.users_organizations.user_id),
      )
      .leftJoin(
        schema.official_contact_email_verifications,
        and(
          eq(
            schema.official_contact_email_verifications.user_id,
            schema.users_organizations.user_id,
          ),
          eq(
            schema.official_contact_email_verifications.organization_id,
            schema.users_organizations.organization_id,
          ),
        ),
      )
      .where(where)
      .orderBy(order_by, desc(schema.users.id))
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
