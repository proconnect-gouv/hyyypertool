//

import type { GetModerationByIdHandler } from "#src/queries/moderations";
import type { GetMemberHandler } from "#src/queries/users";
import type { ForceJoinOrganizationHandler } from "@~/identite-proconnect/sdk";
import { to as await_to } from "await-to-js";

//

export function MemberJoinOrganization({
  force_join_organization,
  get_member,
  get_moderation_by_id,
}: {
  force_join_organization: ForceJoinOrganizationHandler;
  get_member: GetMemberHandler<{ updated_at: true }>;
  get_moderation_by_id: GetModerationByIdHandler;
}) {
  return async function member_join_organization({
    moderation_id,
    is_external,
  }: {
    moderation_id: number;
    is_external: boolean;
  }) {
    const { organization_id, user_id } = await get_moderation_by_id(
      moderation_id,
      {
        columns: {
          organization_id: true,
          user_id: true,
        },
      },
    );

    const [get_member_err] = await await_to(
      get_member({ organization_id, user_id }),
    );

    if (get_member_err) {
      await force_join_organization({
        is_external,
        organization_id,
        user_id,
      });
    }
  };
}
