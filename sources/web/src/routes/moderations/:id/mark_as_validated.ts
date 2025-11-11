//

import type { IdentiteProconnect_PgDatabase } from "@~/identite-proconnect/database";
import type { schema } from "@~/identite-proconnect/database";
import { UpdateModerationById } from "#src/queries/moderations";
import { build_moderation_update } from "#src/lib/moderations";

//

export async function mark_as_validated(
  pg: IdentiteProconnect_PgDatabase,
  moderation: Pick<typeof schema.moderations.$inferSelect, "comment" | "id">,
  userinfo: { email: string; given_name: string; usual_name: string },
) {
  const update = build_moderation_update({
    comment: moderation.comment,
    userinfo,
    reason: "[ProConnect] ✨ Modeation validée",
    type: "VALIDATED",
  });

  const update_moderation_by_id = UpdateModerationById({ pg });
  await update_moderation_by_id(moderation.id, update);
}
