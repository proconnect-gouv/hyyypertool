//

import type { IdentiteProconnectPgDatabase } from "@~/identite-proconnect/database";
import { schema } from "@~/identite-proconnect/database";
import { asc, desc, eq } from "drizzle-orm";

//

export async function get_moderations_by_user_id(
  pg: IdentiteProconnectPgDatabase,
  user_id: number,
) {
  return pg.query.moderations.findMany({
    orderBy: [
      asc(schema.moderations.moderated_at),
      desc(schema.moderations.created_at),
    ],
    where: eq(schema.moderations.user_id, user_id),
  });
}
