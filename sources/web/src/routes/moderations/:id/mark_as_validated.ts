//

import { z_username } from "@~/core/schema";
import type { IdentiteProconnect_PgDatabase } from "@~/identite-proconnect/database";
import type { schema } from "@~/identite-proconnect/database";
import { UpdateModerationById } from "#src/queries/moderations";
import { append_comment } from "#src/lib/moderations";

//

export async function mark_as_validated(
  pg: IdentiteProconnect_PgDatabase,
  moderation: Pick<typeof schema.moderations.$inferSelect, "comment" | "id">,
  userinfo: { email: string },
) {
  const { comment, id: moderation_id } = moderation;
  const username = z_username.parse(userinfo);
  const moderated_by = `${username} <${userinfo.email}>`;

  const update_moderation_by_id = UpdateModerationById({ pg });
  await update_moderation_by_id(moderation_id, {
    comment: append_comment(comment, {
      created_by: userinfo.email,
      reason: "[ProConnect] ✨ Modeation validée",
      type: "VALIDATED",
    }),
    moderated_by,
    moderated_at: new Date().toISOString(),
  });
}
