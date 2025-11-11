//

import { z_username } from "@~/core/schema";
import { append_comment, type Comment_Type } from "./comment_message";

//

export function build_moderation_update({
  comment,
  userinfo,
  reason,
  type,
}: {
  comment: string | null;
  userinfo: { email: string; given_name: string; usual_name: string };
  reason: string;
  type: Comment_Type["type"];
}) {
  const username = z_username.parse(userinfo);
  const moderated_by = `${username} <${userinfo.email}>`;

  return {
    comment: append_comment(comment, {
      created_by: userinfo.email,
      reason,
      type,
    }),
    moderated_by,
    moderated_at: new Date().toISOString(),
  };
}
