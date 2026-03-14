//

import {
  schema,
  type IdentiteProconnectPgDatabase,
} from "@~/identite-proconnect/database";
import { isNotNull } from "drizzle-orm";

//

export async function get_sp_names_list(pg: IdentiteProconnectPgDatabase) {
  const rows = await pg
    .selectDistinct({ sp_name: schema.moderations.sp_name })
    .from(schema.moderations)
    .where(isNotNull(schema.moderations.sp_name))
    .orderBy(schema.moderations.sp_name);

  return ["", ...rows.map((r) => r.sp_name!)];
}
