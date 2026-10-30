//

import { label_actors } from "#src/lib/activities";
import type { HyyyperPgDatabase } from "@~/hyyyperbase";
import type { IdentiteProconnectPgDatabase } from "@~/identite-proconnect/database";

//

export async function get_activities_by_user_id(
  {
    hyyyper_pg,
    pg,
  }: { hyyyper_pg: HyyyperPgDatabase; pg: IdentiteProconnectPgDatabase },
  { user_id }: { user_id: number },
) {
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
      organization_id: true,
    },
    orderBy: (table, { desc }) => [desc(table.created_at), desc(table.id)],
    where: (table, { eq }) => eq(table.user_id, user_id),
  });

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

  const actor_label = await label_actors({ hyyyper_pg, pg }, [
    ...activities,
    ...causes,
  ]);
  const cause_by_id = new Map(causes.map((cause) => [cause.id, cause]));

  return activities.map((activity) => {
    const cause =
      activity.cause_activity_id === null
        ? undefined
        : cause_by_id.get(activity.cause_activity_id);
    const organization =
      activity.organization_id === null
        ? undefined
        : organization_by_id.get(activity.organization_id);

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
    };
  });
}
