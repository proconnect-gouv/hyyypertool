//

import type { IdentiteProconnect_PgDatabase } from "@~/identite-proconnect/database";
import {
  UpdateModerationById,
  type GetModerationWithUserDto,
} from "#src/queries/moderations";
import { build_moderation_update } from "@~/moderations/build_moderation_update";

//

export async function mark_as_processed(
  pg: IdentiteProconnect_PgDatabase,
  moderation: GetModerationWithUserDto,
  userinfo: { email: string; given_name: string; usual_name: string },
) {
  const update = build_moderation_update({
    comment: moderation.comment,
    userinfo,
    reason: "DUPLICATE",
    type: "REJECTED",
  });

  const update_moderation_by_id = UpdateModerationById({ pg });
  await update_moderation_by_id(moderation.id, update);
}
