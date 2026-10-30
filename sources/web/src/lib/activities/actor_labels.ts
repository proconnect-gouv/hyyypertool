//

import type { HyyyperPgDatabase } from "@~/hyyyperbase";

//

type ActorRow = {
  actor_ref: string;
  actor_type: string;
  app: string;
};

export async function label_actors(
  hyyyper_pg: HyyyperPgDatabase,
  rows: ReadonlyArray<ActorRow>,
) {
  const moderator_subs = rows
    .filter(({ actor_type }) => actor_type === "moderator")
    .map(({ actor_ref }) => actor_ref);
  const moderators =
    moderator_subs.length === 0
      ? []
      : await hyyyper_pg.query.users.findMany({
          columns: { email: true, sub: true },
          where: (table, { inArray }) => inArray(table.sub, moderator_subs),
        });
  const email_by_sub = new Map(
    moderators.map(({ email, sub }) => [sub, email]),
  );

  return function actor_label({ actor_ref, actor_type, app }: ActorRow) {
    return actor_type === "moderator"
      ? (email_by_sub.get(actor_ref) ?? actor_ref)
      : `${app} (${actor_ref})`;
  };
}
