//

import type { IdentiteProconnect_PgDatabase } from "@~/identite-proconnect/database";
import { mark_moderatio_as_rejected } from "#src/lib/moderations";
import type { GetModerationWithUserDto } from "#src/queries/moderations";

//

/**
 * Thin wrapper for marking a moderation as processed (rejected with DUPLICATE reason).
 */
export async function mark_as_processed(
  pg: IdentiteProconnect_PgDatabase,
  moderation: GetModerationWithUserDto,
  userinfo: { email: string; given_name: string; usual_name: string },
) {
  await mark_moderatio_as_rejected({
    pg,
    moderation,
    userinfo,
    reason: "DUPLICATE",
  });
}
