//

import { NotFoundError } from "#src/errors";
import {
  schema,
  type IdentiteProconnectPgDatabase,
} from "@~/identite-proconnect/database";
import { eq } from "drizzle-orm";

//

export async function get_moderation(
  pg: IdentiteProconnectPgDatabase,
  moderation_id: number,
) {
  const moderation = await pg.query.moderations.findFirst({
    columns: { organization_id: true, moderated_at: true },
    with: {
      user: { columns: { id: true, family_name: true } },
    },
    where: eq(schema.moderations.id, moderation_id),
  });

  if (!moderation) throw new NotFoundError("Moderation not found.");

  return moderation;
}
