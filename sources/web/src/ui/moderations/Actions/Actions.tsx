//

import type { GetModerationWithDetailsDto } from "#src/queries/moderations";
import { z_email_domain } from "#src/schema";
import type { ResponseTemplateDto } from "../../../routes/response-templates/get_response_templates.query";
import { AcceptFormIsland } from "./AcceptFormIsland";
import { RefusalFormIsland } from "./RefusalFormIsland";
import { Toolbar } from "./Toolbar";

//

type ActionProps = {
  moderation: GetModerationWithDetailsDto;
  response_templates: ResponseTemplateDto[];
};

export async function Actions({ moderation, response_templates }: ActionProps) {
  const domain = z_email_domain.parse(moderation.user.email);

  return (
    <>
      <Toolbar moderation={moderation} />
      <AcceptFormIsland
        moderation_id={moderation.id}
        domain={domain}
        given_name={moderation.user.given_name ?? ""}
        user_email={moderation.user.email}
        organization_name={moderation.organization.cached_libelle}
        moderation_type={moderation.type}
      />
      <RefusalFormIsland
        moderation_id={moderation.id}
        user_email={moderation.user.email}
        organization_name={moderation.organization.cached_libelle}
        response_templates={response_templates}
      />
    </>
  );
}
