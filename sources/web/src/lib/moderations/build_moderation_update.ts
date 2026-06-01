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
  end_user_reason,
  type,
}: {
  comment: string | null;
  userinfo: { email: string };
  end_user_reason: string;
  type: CommentMeta["type"];
}) {
  const moderated_by = userinfo.email;

  return {
    comment: append_comment(comment, {
      created_by: userinfo.email,
      reason: end_user_reason,
      type,
    }),
    moderated_by,
    moderated_at: new Date().toISOString(),
    status: comment_type_to_status(type),
    end_user_reason,
    allow_editing: false,
  };
}
