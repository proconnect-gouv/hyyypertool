//

import type { GetModerationWithDetailsDto } from "#src/queries/moderations";
import { z_email_domain } from "#src/schema";
import type { ResponseTemplateDto } from "../../../routes/response-templates/get_response_templates.query";
import { ActionsIsland } from "./ActionsIsland";

//

type ActionProps = {
  moderation: GetModerationWithDetailsDto;
  response_templates: ResponseTemplateDto[];
  is_editor?: boolean;
};

export async function Actions({ moderation, response_templates, is_editor = true }: ActionProps) {
  const domain = z_email_domain.parse(moderation.user.email);

  return (
    <ActionsIsland
      moderation_id={moderation.id}
      moderated_at={moderation.moderated_at}
      domain={domain}
      given_name={moderation.user.given_name ?? ""}
      user_email={moderation.user.email}
      organization_name={moderation.organization.cached_libelle}
      moderation_type={moderation.type}
      response_templates={response_templates}
      is_editor={is_editor}
    />
  );
}
