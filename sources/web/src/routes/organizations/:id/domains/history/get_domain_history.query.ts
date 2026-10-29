//

import {
  schema as hyyyper_schema,
  type HyyyperPgDatabase,
} from "@~/hyyyperbase";
import {
  schema,
  type IdentiteProconnectPgDatabase,
} from "@~/identite-proconnect/database";
import { and, asc, eq, inArray } from "drizzle-orm";

//

export async function get_domain_history(
  {
    hyyyper_pg,
    pg,
  }: { hyyyper_pg: HyyyperPgDatabase; pg: IdentiteProconnectPgDatabase },
  { organization_id }: { organization_id: number },
) {
  const activities = await pg.query.activity_logs.findMany({
    columns: {
      action: true,
      actor_ref: true,
      actor_type: true,
      app: true,
      context: true,
      created_at: true,
      id: true,
    },
    orderBy: (table, { desc }) => [desc(table.created_at), desc(table.id)],
    where: (table, { and, eq, like }) =>
      and(
        eq(table.organization_id, organization_id),
        like(table.action, "domain.%"),
      ),
  });

  const activity_ids = activities.map(({ id }) => id);
  const caused =
    activity_ids.length === 0
      ? []
      : await pg
          .select({
            action: schema.activity_logs.action,
            cause_activity_id: schema.activity_logs.cause_activity_id,
            context: schema.activity_logs.context,
            id: schema.activity_logs.id,
            user_email: schema.users.email,
            user_id: schema.activity_logs.user_id,
          })
          .from(schema.activity_logs)
          .leftJoin(
            schema.users,
            eq(schema.users.id, schema.activity_logs.user_id),
          )
          .where(
            and(
              // organization_id first: served by (organization_id, created_at)
              eq(schema.activity_logs.organization_id, organization_id),
              inArray(schema.activity_logs.cause_activity_id, activity_ids),
            ),
          )
          .orderBy(asc(schema.activity_logs.id));

  const moderator_subs = activities
    .filter(({ actor_type }) => actor_type === "moderator")
    .map(({ actor_ref }) => actor_ref);
  const moderators =
    moderator_subs.length === 0
      ? []
      : await hyyyper_pg
          .select({
            email: hyyyper_schema.users.email,
            sub: hyyyper_schema.users.sub,
          })
          .from(hyyyper_schema.users)
          .where(inArray(hyyyper_schema.users.sub, moderator_subs));
  const email_by_sub = new Map(
    moderators.map(({ email, sub }) => [sub, email]),
  );

  return activities.map(({ actor_ref, actor_type, app, id, ...activity }) => ({
    ...activity,
    actor:
      actor_type === "moderator"
        ? (email_by_sub.get(actor_ref) ?? actor_ref)
        : `${app} (${actor_ref})`,
    caused: caused
      .filter(({ cause_activity_id }) => cause_activity_id === id)
      .map(({ action, context, id, user_email, user_id }) => ({
        action,
        context,
        id,
        target: user_email ?? `utilisateur #${user_id}`,
      })),
    id,
  }));
}
