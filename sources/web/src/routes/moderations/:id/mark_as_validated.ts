//

import { UpdateModerationById } from "#src/queries/moderations";
import type {
  IdentiteProconnectPgDatabase,
  schema,
} from "@~/identite-proconnect/database";
import { build_moderation_update } from "@~/moderations/build_moderation_update";

//

export async function mark_as_validated(
  pg: IdentiteProconnectPgDatabase,
  moderation: Pick<typeof schema.moderations.$inferSelect, "comment" | "id">,
  userinfo: { email: string; given_name: string; usual_name: string },
) {
  const update = build_moderation_update({
    comment: moderation.comment,
    userinfo,
    reason: "[ProConnect] ✨ Modération validée",
    type: "VALIDATED",
  });

  const update_moderation_by_id = UpdateModerationById({ pg });
  await update_moderation_by_id(moderation.id, update);
}
