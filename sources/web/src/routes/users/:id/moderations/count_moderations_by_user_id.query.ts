//

import {
  schema,
  type IdentiteProconnectPgDatabase,
} from "@~/identite-proconnect/database";
import { count as drizzle_count, eq } from "drizzle-orm";

//

export async function count_moderations_by_user_id(
  pg: IdentiteProconnectPgDatabase,
  user_id: number,
) {
  const [{ value: count } = { value: NaN }] = await pg
    .select({ value: drizzle_count() })
    .from(schema.moderations)
    .where(eq(schema.moderations.user_id, user_id));

  return count;
}
