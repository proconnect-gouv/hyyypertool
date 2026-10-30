//

import type { HyyyperPgDatabase } from "@~/hyyyperbase";
import type { IdentiteProconnectPgDatabase } from "@~/identite-proconnect/database";

//

type ActorRow = {
  actor_ref: string;
  actor_type: string;
  app: string;
};

export async function label_actors(
  {
    hyyyper_pg,
    pg,
  }: { hyyyper_pg: HyyyperPgDatabase; pg: IdentiteProconnectPgDatabase },
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

  const user_ids = rows
    .filter(({ actor_type }) => actor_type === "user")
    .map(({ actor_ref }) => Number(actor_ref));
  const users =
    user_ids.length === 0
      ? []
      : await pg.query.users.findMany({
          columns: { email: true, id: true },
          where: (table, { inArray }) => inArray(table.id, user_ids),
        });
  const email_by_user_id = new Map(users.map(({ email, id }) => [id, email]));

  return function actor_label({ actor_ref, actor_type, app }: ActorRow) {
    switch (actor_type) {
      case "moderator":
        return email_by_sub.get(actor_ref) ?? actor_ref;
      case "user":
        return (
          email_by_user_id.get(Number(actor_ref)) ?? `utilisateur #${actor_ref}`
        );
      default:
        return `${app} (${actor_ref})`;
    }
  };
}
