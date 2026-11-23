//

import {
  schema,
  type IdentiteProconnectPgDatabase,
} from "@~/identite-proconnect/database";
import { eq } from "drizzle-orm";

//

export async function get_recovery_words_by_user_id(
  pg: IdentiteProconnectPgDatabase,
  id: number,
) {
  return pg.query.recovery_words.findFirst({
    columns: {
      created_at: true,
    },
    where: eq(schema.recovery_words.user_id, id),
  });
}
