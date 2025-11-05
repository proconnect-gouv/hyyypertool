import {
  schema,
  type IdentiteProconnect_PgDatabase,
} from "@~/identite-proconnect.database";
import {
  and,
  asc,
  count as drizzle_count,
  eq,
  ilike,
  isNull,
  not,
  sql,
} from "drizzle-orm";

export async function get_moderations_list(
  pg: IdentiteProconnect_PgDatabase,
  {
    search,
    pagination = { page: 0, take: 10 },
  }: {
    search: {
      created_at?: Date;
      email?: string;
      hide_join_organization?: boolean;
      hide_non_verified_domain?: boolean;
      show_archived?: boolean;
      siret?: string;
    };
    pagination?: { page: number; take: number };
  },
) {
  const { page, take } = pagination;
  const {
    created_at,
    email,
    hide_join_organization,
    hide_non_verified_domain,
    show_archived,
    siret,
  } = search;

  const where = and(
    ilike(schema.organizations.siret, `%${siret ?? ""}%`),
    ilike(schema.users.email, `%${email ?? ""}%`),
    show_archived ? undefined : isNull(schema.moderations.moderated_at),
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
        type: schema.moderations.type,
        user: {
          email: schema.users.email,
          family_name: schema.users.family_name,
          given_name: schema.users.given_name,
        },
      })
      .from(schema.moderations)
      .innerJoin(
        schema.users,
        eq(schema.moderations.user_id, schema.users.id),
      )
      .innerJoin(
        schema.organizations,
        eq(schema.moderations.organization_id, schema.organizations.id),
      )
      .where(where)
      .orderBy(asc(schema.moderations.created_at))
      .limit(take)
      .offset(page * take);
    const [{ value: count }] = await tx
      .select({ value: drizzle_count() })
      .from(schema.moderations)
      .innerJoin(
        schema.users,
        eq(schema.moderations.user_id, schema.users.id),
      )
      .innerJoin(
        schema.organizations,
        eq(schema.moderations.organization_id, schema.organizations.id),
      )
      .where(where);
    return { moderations, count };
  });
}
