//

import { z_username } from "@~/core/schema";
import type { IdentiteProconnect_PgDatabase } from "@~/identite-proconnect/database";
import {
  UpdateModerationById,
  type GetModerationWithUserDto,
} from "#src/queries/moderations";
import { append_comment } from "#src/lib/moderations";

//

export async function mark_as_processed(
  pg: IdentiteProconnect_PgDatabase,
  moderation: GetModerationWithUserDto,
  userinfo: { email: string; given_name: string; usual_name: string },
) {
  const { comment, id: moderation_id } = moderation;
  const moderated_by = z_username.parse(userinfo);

  const update_moderation_by_id = UpdateModerationById({ pg });
  await update_moderation_by_id(moderation_id, {
    comment: append_comment(comment, {
      created_by: userinfo.email,
      reason: "DUPLICATE",
      type: "REJECTED",
    }),
    moderated_by,
    moderated_at: new Date().toISOString(),
  });
}
