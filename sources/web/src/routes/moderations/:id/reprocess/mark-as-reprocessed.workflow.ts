//

import type { IdentiteProconnect_PgDatabase } from "@~/identite-proconnect/database";
import {
  GetModerationById,
  RemoveUserFromOrganization,
  UpdateModerationById,
} from "#src/queries/moderations";
import { append_comment } from "#src/lib/moderations";

//

export async function mark_as_reprocessed(
  pg: IdentiteProconnect_PgDatabase,
  id: number,
  userinfo: { email: string },
) {
  const get_moderation_by_id = GetModerationById({ pg });
  const remove_user_from_organization = RemoveUserFromOrganization({ pg });
  const update_moderation_by_id = UpdateModerationById({ pg });

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
}
