//

import {
  schema,
  type IdentiteProconnectPgDatabase,
} from "@~/identite-proconnect/database";
import { and, asc, eq } from "drizzle-orm";

//

export async function get_duplicate_moderations(
  pg: IdentiteProconnectPgDatabase,
  {
    organization_id,
    user_id,
  }: {
    organization_id: number;
    user_id: number;
  },
) {
  return pg.query.moderations.findMany({
    columns: {
      created_at: true,
      id: true,
      moderated_at: true,
      status: true,
      ticket_id: true,
    },
    where: and(
      eq(schema.moderations.organization_id, organization_id),
      eq(schema.moderations.user_id, user_id),
    ),
    orderBy: asc(schema.moderations.created_at),
  });
}
