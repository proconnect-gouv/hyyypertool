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
} from "drizzle-orm";
import type { Search } from "./context";

//

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
  const {
    day: created_at,
    search_email: email,
    search_moderated_by: moderated_by,
    exclude_email,
    exclude_moderated_by,
    exclude_siret,
    exclude_sp_names,
    hide_join_organization,
    hide_non_verified_domain,
    processed_requests: show_archived,
    search_siret: siret,
    search_text,
  } = search;

  const where = and(
    ilike(schema.organizations.siret, `%${siret ?? ""}%`),
    ilike(schema.users.email, `%${email ?? ""}%`),
    moderated_by
      ? ilike(schema.moderations.moderated_by, `%${moderated_by}%`)
      : undefined,
    exclude_email
      ? not(ilike(schema.users.email, `%${exclude_email}%`))
      : undefined,
    exclude_siret
      ? not(ilike(schema.organizations.siret, `%${exclude_siret}%`))
      : undefined,
    exclude_moderated_by
      ? not(ilike(schema.moderations.moderated_by, `%${exclude_moderated_by}%`))
      : undefined,
    search_text
      ? or(
          ilike(schema.users.email, `%${search_text}%`),
          ilike(schema.organizations.siret, `%${search_text}%`),
          ilike(schema.users.family_name, `%${search_text}%`),
          ilike(schema.users.given_name, `%${search_text}%`),
        )
      : undefined,
    exclude_sp_names?.length
      ? and(
          exclude_sp_names.includes("")
            ? isNotNull(schema.moderations.sp_name)
            : undefined,
          exclude_sp_names.filter(Boolean).length
            ? or(
                isNull(schema.moderations.sp_name),
                not(
                  inArray(
                    schema.moderations.sp_name,
                    exclude_sp_names.filter(Boolean),
                  ),
                ),
              )
            : undefined,
        )
      : undefined,
    show_archived === true
      ? isNotNull(schema.moderations.moderated_at)
      : show_archived === false
        ? isNull(schema.moderations.moderated_at)
        : undefined,
    hide_non_verified_domain
      ? not(eq(schema.moderations.type, "non_verified_domain"))
      : undefined,
    hide_join_organization
      ? not(eq(schema.moderations.type, "organization_join_block"))
      : undefined,
    created_at
      ? sql`(${schema.moderations.created_at} AT TIME ZONE 'Europe/Paris')::date = ${created_at}`
      : undefined,
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
