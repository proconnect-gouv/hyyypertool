//

import type {
  GetModerationByIdHandler,
  RemoveUserFromOrganizationHandler,
  UpdateModerationByIdHandler,
} from "@~/moderations.repository";
import { append_comment } from "../comment_message";

//

export function ReprocessModerationById({
  get_moderation_by_id,
  remove_user_from_organization,
  update_moderation_by_id,
  userinfo,
}: {
  get_moderation_by_id: GetModerationByIdHandler;
  remove_user_from_organization: RemoveUserFromOrganizationHandler;
  update_moderation_by_id: UpdateModerationByIdHandler;
  userinfo: { email: string };
}) {
  return async function reprocess_moderation_by_id(id: number) {
    const moderation = await get_moderation_by_id(id, {
      columns: { comment: true, organization_id: true, user_id: true },
    });

    const comment = append_comment(moderation.comment, {
      type: "REPROCESSED",
      created_by: userinfo.email,
    });

    await remove_user_from_organization({
      organization_id: moderation.organization_id,
      user_id: moderation.user_id,
    });

    await update_moderation_by_id(id, {
      comment,
      moderated_by: null,
      moderated_at: null,
    });
  };
}
