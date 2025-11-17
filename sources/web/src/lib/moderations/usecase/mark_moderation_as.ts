//

import { UpdateModerationById } from "#src/queries/moderations";
import { z_username } from "@~/core/schema";
import { type ModerationStatus } from "@~/identite-proconnect";
import type {
  IdentiteProconnect_PgDatabase,
  schema,
} from "@~/identite-proconnect/database";
import { comment_type_to_status } from "@~/moderations/comment_message";
import { append_comment, type CommentType } from "../comment_message";

//

export async function mark_moderation_as(
  {
    moderation,
    pg,
    reason,
    userinfo,
  }: {
    moderation: Pick<typeof schema.moderations.$inferSelect, "comment" | "id">;
    pg: IdentiteProconnect_PgDatabase;
    reason: string;
    userinfo: { email: string };
  },
  type: CommentType["type"],
) {
  const { comment, id: moderation_id } = moderation;
  const username = z_username.parse(userinfo);
  const moderated_by = `${username} <${userinfo.email}>`;
  const status: ModerationStatus = comment_type_to_status(type);
  const update_moderation_by_id = UpdateModerationById({ pg });
  await update_moderation_by_id(moderation_id, {
    comment: append_comment(comment, {
      created_by: userinfo.email,
      reason,
      type,
    }),
    moderated_by,
    moderated_at: new Date().toISOString(),
    status,
  });
}
