//

import type { GetModerationWithDetailsDto } from "#src/queries/moderations";
import { z_email_domain } from "#src/schema";
import type { IdentiteProconnectDatabaseCradle } from "@~/identite-proconnect/database";
import { SuggestOrganizationDomains } from "./SuggestOrganizationDomains";
import { SuggestSameUserEmails } from "#src/lib/users/usecase";

//

export async function build_template_data(
  moderation: GetModerationWithDetailsDto,
  { pg }: IdentiteProconnectDatabaseCradle,
): Promise<Record<string, string>> {
  const domain = z_email_domain.parse(moderation.user.email);

  const [suggest_emails, suggest_domains] = await Promise.all([
    SuggestSameUserEmails({ pg })({
      family_name: moderation.user.family_name ?? "",
      organization_id: moderation.organization_id,
    }),
    SuggestOrganizationDomains({ pg })(moderation.organization_id),
  ]);

  return {
    domain,
    organization_name: moderation.organization.cached_libelle ?? "",
    siret: moderation.organization.siret,
    categorie_juridique:
      moderation.organization.cached_libelle_categorie_juridique ?? "",
    email: moderation.user.email,
    given_name: moderation.user.given_name ?? "",
    family_name: moderation.user.family_name ?? "",
    suggest_emails_associated_to_user: suggest_emails.join(", "),
    suggest_organization_domains: suggest_domains.join(", "),
  };
}
