//

import { label_actors } from "#src/lib/activities";
import type { Pagination } from "#src/schema";
import type { HyyyperPgDatabase } from "@~/hyyyperbase";
import {
  schema,
  type IdentiteProconnectPgDatabase,
} from "@~/identite-proconnect/database";
import { and, count as drizzle_count, inArray, sql } from "drizzle-orm";

//

const action_category = sql<string>`split_part(${schema.activity_logs.action}, '.', 1)`;

export async function get_activity_categories(
  pg: IdentiteProconnectPgDatabase,
) {
  const categories = await pg
    .selectDistinct({ category: action_category })
    .from(schema.activity_logs)
    .orderBy(action_category);

  return categories.map(({ category }) => category);
}

export async function get_activities(
  {
    hyyyper_pg,
    pg,
  }: { hyyyper_pg: HyyyperPgDatabase; pg: IdentiteProconnectPgDatabase },
  {
    categories,
    pagination,
  }: { categories: ReadonlyArray<string>; pagination: Pagination },
) {
  const { page, page_size: take } = pagination;
  const where = and(
    categories.length > 0
      ? inArray(action_category, [...categories])
      : undefined,
  );

  const activities = await pg.query.activity_logs.findMany({
    columns: {
      action: true,
      actor_ref: true,
      actor_type: true,
      app: true,
      cause_activity_id: true,
      context: true,
      created_at: true,
      id: true,
      moderation_id: true,
      organization_id: true,
      user_id: true,
    },
    limit: take,
    offset: page * take,
    orderBy: (table, { desc }) => [desc(table.id)],
    where: () => where,
  });
  const [{ value: count } = { value: NaN }] = await pg
    .select({ value: drizzle_count() })
    .from(schema.activity_logs)
    .where(where);

  const organization_ids = activities.flatMap(({ organization_id }) =>
    organization_id === null ? [] : [organization_id],
  );
  const organizations =
    organization_ids.length === 0
      ? []
      : await pg.query.organizations.findMany({
          columns: { cached_libelle: true, id: true, siret: true },
          where: (table, { inArray }) => inArray(table.id, organization_ids),
        });
  const organization_by_id = new Map(
    organizations.map((organization) => [organization.id, organization]),
  );

  const user_ids = activities.flatMap(({ user_id }) =>
    user_id === null ? [] : [user_id],
  );
  const users =
    user_ids.length === 0
      ? []
      : await pg.query.users.findMany({
          columns: { email: true, id: true },
          where: (table, { inArray }) => inArray(table.id, user_ids),
        });
  const user_by_id = new Map(users.map((user) => [user.id, user]));

  const cause_ids = activities.flatMap(({ cause_activity_id }) =>
    cause_activity_id === null ? [] : [cause_activity_id],
  );
  const causes =
    cause_ids.length === 0
      ? []
      : await pg.query.activity_logs.findMany({
          columns: {
            action: true,
            actor_ref: true,
            actor_type: true,
            app: true,
            context: true,
            id: true,
          },
          where: (table, { inArray }) => inArray(table.id, cause_ids),
        });
  const cause_by_id = new Map(causes.map((cause) => [cause.id, cause]));

  const actor_label = await label_actors({ hyyyper_pg, pg }, [
    ...activities,
    ...causes,
  ]);

  return {
    activities: activities.map((activity) => {
      const cause =
        activity.cause_activity_id === null
          ? undefined
          : cause_by_id.get(activity.cause_activity_id);
      const organization =
        activity.organization_id === null
          ? undefined
          : organization_by_id.get(activity.organization_id);
      const user =
        activity.user_id === null
          ? undefined
          : user_by_id.get(activity.user_id);

      return {
        action: activity.action,
        actor: actor_label(activity),
        cause: cause
          ? {
              action: cause.action,
              actor: actor_label(cause),
              context: cause.context,
              id: cause.id,
            }
          : null,
        context: activity.context,
        created_at: activity.created_at,
        id: activity.id,
        moderation_id: activity.moderation_id,
        organization:
          activity.organization_id === null
            ? null
            : {
                id: activity.organization_id,
                label:
                  organization?.cached_libelle ??
                  organization?.siret ??
                  `organisation #${activity.organization_id}`,
              },
        user:
          activity.user_id === null
            ? null
            : { id: activity.user_id, label: user?.email ?? null },
      };
    }),
    count,
  };
}
