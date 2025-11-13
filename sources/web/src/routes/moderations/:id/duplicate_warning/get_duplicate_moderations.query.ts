//

import {
  schema,
  type IdentiteProconnect_PgDatabase,
} from "@~/identite-proconnect/database";
import { and, asc, eq } from "drizzle-orm";

//

export async function get_duplicate_moderations(
  pg: IdentiteProconnect_PgDatabase,
  {
    organization_id,
    user_id,
  }: {
    organization_id: number;
    user_id: number;
  },
) {
  return pg
    .select()
    .from(schema.moderations)
    .where(
      and(
        eq(schema.moderations.organization_id, organization_id),
        eq(schema.moderations.user_id, user_id),
      ),
    )
    .orderBy(asc(schema.moderations.created_at));
}
