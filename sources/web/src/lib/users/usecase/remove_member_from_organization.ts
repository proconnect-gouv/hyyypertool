import type { CrispApiCradle } from "#src/lib/crisp";
import { get_fiche_organization_by_id } from "#src/lib/organizations/usecase";
import { remove_user_from_organization } from "#src/queries/moderations";
import { z_username } from "#src/schema";
import type { IdentiteProconnectDatabaseCradle } from "@~/identite-proconnect/database";
import { to as await_to } from "await-to-js";
import { remove_from_organization_message } from "../templates";
import { get_user_info } from "./get_user_info";

export type RemoveMemberFromOrganizationInput = {
  moderator: { email: string };
  organization_id: number;
  user_id: number;
};

export async function remove_member_from_organization(
  {
    crisp,
    pg,
    resolve_delay,
  }: IdentiteProconnectDatabaseCradle &
    CrispApiCradle & { resolve_delay: number },
  { moderator, organization_id, user_id }: RemoveMemberFromOrganizationInput,
) {
  const { email, given_name, family_name } = await get_user_info(pg, user_id);
  const nickname = z_username.parse({ given_name, usual_name: family_name });

  const { cached_libelle, siret } = await get_fiche_organization_by_id(
    pg,
    organization_id,
  );
  const organization_name = cached_libelle ?? siret;

  const [, found_user] = await await_to(
    crisp.get_user({ email: moderator.email }),
  );
  const user = found_user ?? {
    nickname: z_username.parse(moderator),
    email: moderator.email,
  };
  await remove_user_from_organization(pg, { organization_id, user_id });

  const { session_id } = await crisp.create_conversation({
    email,
    subject: "[ProConnect] - Retrait d'une organisation",
    nickname,
  });

  await crisp.send_message({
    content: remove_from_organization_message({ organization_name }),
    session_id,
    user,
  });

  await new Promise((resolve) => setTimeout(resolve, resolve_delay));

  await crisp.mark_conversation_as_resolved({ session_id });
}

export type RemoveMemberFromOrganizationHandler =
  typeof remove_member_from_organization;
