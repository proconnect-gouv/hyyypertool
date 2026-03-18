//

import {
  append_comment,
  comment_type_to_status,
  type CommentMeta,
} from "./comment_message";

//

export function build_moderation_update({
  comment,
  userinfo,
  reason,
  type,
}: {
  comment: string | null;
  userinfo: { email: string };
  reason: string;
  type: CommentMeta["type"];
}) {
  const moderated_by = userinfo.email;

  return {
    comment: append_comment(comment, {
      created_by: userinfo.email,
      reason,
      type,
    }),
    moderated_by,
    moderated_at: new Date().toISOString(),
    status: comment_type_to_status(type),
  };
}
