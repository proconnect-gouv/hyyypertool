//

import { NotFoundError } from "#src/errors";
import {
  schema,
  type IdentiteProconnect_PgDatabase,
} from "@~/identite-proconnect.database";
import { eq } from "drizzle-orm";

//

export async function get_moderation_by_id(
  pg: IdentiteProconnect_PgDatabase,
  moderation_id: number,
) {
  const moderation = await pg.query.moderations.findFirst({
    where: eq(schema.moderations.id, moderation_id),
  });

  if (!moderation) {
    throw new NotFoundError("Moderation not found");
  }

  return moderation;
}
