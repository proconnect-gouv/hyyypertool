//

import {
  schema,
  type IdentiteProconnect_PgDatabase,
} from "@~/identite-proconnect/database";
import { eq } from "drizzle-orm";

//

export async function find_moderation_for_email(
  pg: IdentiteProconnect_PgDatabase,
  moderation_id: number,
) {
  return pg.query.moderations.findFirst({
    columns: { ticket_id: true },
    where: eq(schema.moderations.id, moderation_id),
    with: { user: { columns: { email: true } } },
  });
}
