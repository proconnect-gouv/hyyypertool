//

import {
  schema as hyyyper_schema,
  type HyyyperPgDatabase,
} from "@~/hyyyperbase";
import type { IdentiteProconnectPgDatabase } from "@~/identite-proconnect/database";
import { inArray } from "drizzle-orm";

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

  return activities.map(({ actor_ref, actor_type, app, ...activity }) => ({
    ...activity,
    actor:
      actor_type === "moderator"
        ? (email_by_sub.get(actor_ref) ?? actor_ref)
        : `${app} (${actor_ref})`,
  }));
}
