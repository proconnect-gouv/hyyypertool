//

import type { IdentiteProconnect_PgDatabase } from "@~/identite-proconnect/database";
import type { schema } from "@~/identite-proconnect/database";
import { mark_moderation_as } from "#src/lib/moderations";

//

/**
 * Thin wrapper for marking a moderation as validated.
 */
export async function mark_as_validated(
  pg: IdentiteProconnect_PgDatabase,
  moderation: Pick<typeof schema.moderations.$inferSelect, "comment" | "id">,
  userinfo: { email: string },
) {
  await mark_moderation_as(
    {
      moderation,
      pg,
      reason: "[ProConnect] ✨ Modeation validée",
      userinfo,
    },
    "VALIDATED",
  );
}
