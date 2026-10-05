//

import type { CrispApiCradle } from "#src/lib/crisp";
import { GetFicheOrganizationById } from "#src/lib/organizations/usecase";
import { RemoveUserFromOrganization } from "#src/queries/moderations";
import { z_username } from "#src/schema";
import type { IdentiteProconnectDatabaseCradle } from "@~/identite-proconnect/database";
import { to as await_to } from "await-to-js";
import { RemoveFromOrganizationMessage } from "../templates";
import { GetUserInfo } from "./GetUserInfo";

//

export function RemoveMemberFromOrganization({
  crisp,
  resolve_delay,
  pg,
}: IdentiteProconnectDatabaseCradle &
  CrispApiCradle & { resolve_delay: number }) {
  type RemoveMemberFromOrganization_Input = {
    moderator: { email: string };
    organization_id: number;
    user_id: number;
  };
  return async function remove_member_from_organization({
    moderator,
    organization_id,
    user_id,
  }: RemoveMemberFromOrganization_Input) {
    const get_user = GetUserInfo({ pg });
    const { email, given_name, family_name } = await get_user(user_id);

    const get_organization = GetFicheOrganizationById({ pg });
    const { cached_libelle, siret } = await get_organization(organization_id);
    const organization_name = cached_libelle ?? siret;

    const remove_user_from_organization = RemoveUserFromOrganization({ pg });
    await remove_user_from_organization({ organization_id, user_id });

    const nickname = z_username.parse({ given_name, usual_name: family_name });
    const { session_id } = await crisp.create_conversation({
      email,
      subject: "[ProConnect] - Retrait d'une organisation",
      nickname,
    });

    const [, found_user] = await await_to(
      crisp.get_user({ email: moderator.email }),
    );
    const user = found_user ?? {
      nickname: z_username.parse(moderator),
      email: moderator.email,
    };

    await crisp.send_message({
      content: RemoveFromOrganizationMessage({ organization_name }),
      session_id,
      user,
    });

    await new Promise((resolve) => setTimeout(resolve, resolve_delay));

    await crisp.mark_conversation_as_resolved({ session_id });
  };
}

//

export type RemoveMemberFromOrganizationHandler = ReturnType<
  typeof RemoveMemberFromOrganization
>;
