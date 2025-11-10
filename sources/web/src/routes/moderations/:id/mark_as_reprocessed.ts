//

import type { IdentiteProconnect_PgDatabase } from "@~/identite-proconnect/database";
import { ReprocessModerationById } from "#src/lib/moderations";
import {
  GetModerationById,
  RemoveUserFromOrganization,
  UpdateModerationById,
} from "#src/queries/moderations";

//

/**
 * Thin wrapper around ReprocessModerationById usecase.
 * Reprocesses a moderation by resetting it to pending state and removing user from organization.
 */
export async function mark_as_reprocessed(
  pg: IdentiteProconnect_PgDatabase,
  id: number,
  userinfo: { email: string },
) {
  const reprocess_moderation_by_id = ReprocessModerationById({
    get_moderation_by_id: GetModerationById({ pg }),
    remove_user_from_organization: RemoveUserFromOrganization({ pg }),
    update_moderation_by_id: UpdateModerationById({ pg }),
    userinfo,
  });

  await reprocess_moderation_by_id(id);
}
