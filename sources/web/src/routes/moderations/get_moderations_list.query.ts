//

import type { Pagination } from "#src/schema";
import {
  schema,
  type IdentiteProconnectPgDatabase,
} from "@~/identite-proconnect/database";
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
  type SQL,
} from "drizzle-orm";
import type { Search } from "./context";

//

const qualifier_filters: Record<
  string,
  (search: Partial<Search>) => (SQL | undefined)[]
> = {
  email: (s) => [
    ilike(schema.users.email, `%${s.search_email ?? ""}%`),
    s.exclude_email
      ? not(ilike(schema.users.email, `%${s.exclude_email}%`))
      : undefined,
  ],
  siret: (s) => [
    ilike(schema.organizations.siret, `%${s.search_siret ?? ""}%`),
    s.exclude_siret
      ? not(ilike(schema.organizations.siret, `%${s.exclude_siret}%`))
      : undefined,
  ],
  by: (s) => [
    s.search_moderated_by
      ? ilike(schema.moderations.moderated_by, `%${s.search_moderated_by}%`)
      : undefined,
    s.exclude_moderated_by
      ? not(
          ilike(schema.moderations.moderated_by, `%${s.exclude_moderated_by}%`),
        )
      : undefined,
  ],
  type: (s) => [
    s.search_type ? eq(schema.moderations.type, s.search_type) : undefined,
    ...(s.exclude_types ?? []).map((t) => not(eq(schema.moderations.type, t))),
  ],
  service: (s) => [
    s.sp_names?.length
      ? or(
          s.sp_names.includes("")
            ? isNull(schema.moderations.sp_name)
            : undefined,
          s.sp_names.filter(Boolean).length
            ? inArray(schema.moderations.sp_name, s.sp_names.filter(Boolean))
            : undefined,
        )
      : undefined,
    s.exclude_sp_names?.length
      ? and(
          s.exclude_sp_names.includes("")
            ? isNotNull(schema.moderations.sp_name)
            : undefined,
          s.exclude_sp_names.filter(Boolean).length
            ? or(
                isNull(schema.moderations.sp_name),
                not(
                  inArray(
                    schema.moderations.sp_name,
                    s.exclude_sp_names.filter(Boolean),
                  ),
                ),
              )
            : undefined,
        )
      : undefined,
  ],
  is: (s) => [
    s.processed_requests === true
      ? isNotNull(schema.moderations.moderated_at)
      : s.processed_requests === false
        ? isNull(schema.moderations.moderated_at)
        : undefined,
  ],
  date: (s) => [
    s.day
      ? sql`(${schema.moderations.created_at} AT TIME ZONE 'Europe/Paris')::date = ${s.day}`
      : undefined,
    s.exclude_day
      ? not(
          sql`(${schema.moderations.created_at} AT TIME ZONE 'Europe/Paris')::date = ${s.exclude_day}`,
        )
      : undefined,
  ],
  text: (s) => [
    s.search_text
      ? or(
          ilike(schema.users.email, `%${s.search_text}%`),
          ilike(schema.organizations.siret, `%${s.search_text}%`),
          ilike(schema.users.family_name, `%${s.search_text}%`),
          ilike(schema.users.given_name, `%${s.search_text}%`),
        )
      : undefined,
  ],
};

export async function get_moderations_list(
  pg: IdentiteProconnectPgDatabase,
  {
    pagination,
    search,
  }: {
    pagination?: Pagination;
    search: Partial<Search>;
  },
) {
  const { page, page_size: take } = pagination ?? { page: 0, page_size: 10 };

  const where = and(
    ...Object.values(qualifier_filters).flatMap((fn) => fn(search)),
  );
  return pg.transaction(async function moderation_count(tx) {
    const moderations = await tx
      .select({
        created_at: schema.moderations.created_at,
        id: schema.moderations.id,
        moderated_at: schema.moderations.moderated_at,
        organization: { siret: schema.organizations.siret },
        sp_name: schema.moderations.sp_name,
        status: schema.moderations.status,
        type: schema.moderations.type,
        user: {
          email: schema.users.email,
          family_name: schema.users.family_name,
          given_name: schema.users.given_name,
        },
      })
      .from(schema.moderations)
      .innerJoin(schema.users, eq(schema.moderations.user_id, schema.users.id))
      .innerJoin(
        schema.organizations,
        eq(schema.moderations.organization_id, schema.organizations.id),
      )
      .where(where)
      .orderBy(asc(schema.moderations.created_at))
      .limit(take)
      .offset(page * take);
    const [{ value: count } = { value: NaN }] = await tx
      .select({ value: drizzle_count() })
      .from(schema.moderations)
      .innerJoin(schema.users, eq(schema.moderations.user_id, schema.users.id))
      .innerJoin(
        schema.organizations,
        eq(schema.moderations.organization_id, schema.organizations.id),
      )
      .where(where);
    return { moderations, count };
  });
}
