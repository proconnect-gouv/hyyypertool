//

import {
  schema,
  type IdentiteProconnectPgDatabase,
} from "@~/identite-proconnect/database";
import { sql } from "drizzle-orm";

//

export async function get_moderators_list(
  pg: IdentiteProconnectPgDatabase,
): Promise<string[]> {
  const result = await pg
    .selectDistinct({ moderated_by: schema.moderations.moderated_by })
    .from(schema.moderations)
    .where(sql`${schema.moderations.moderated_by} is not null`);

  return result.map((r) => r.moderated_by!);
}
