//

import { GetDomains } from "#src/queries/organizations";
import { type IdentiteProconnectDatabaseCradle } from "@~/identite-proconnect.database";

//

export function SuggestOrganizationDomains({
  pg,
}: IdentiteProconnectDatabaseCradle) {
  return async function suggest_organization_domains(organization_id: number) {
    const get_domains = GetDomains(pg);
    const domains = await get_domains(organization_id);
    return domains.map(({ domain }) => domain);
  };
}

export type SuggestOrganizationDomainsHandler = ReturnType<
  typeof SuggestOrganizationDomains
>;
