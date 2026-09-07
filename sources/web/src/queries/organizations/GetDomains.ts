//

import { EmailDomainApprovedVerificationValues } from "@proconnect-gouv/proconnect.identite/types";
import { type IdentiteProconnectPgDatabase } from "@~/identite-proconnect/database";

//

export function GetDomains(pg: IdentiteProconnectPgDatabase) {
  return async function get_domains(organization_id: number) {
    return pg.query.email_domains.findMany({
      where: (email_domains, { eq, inArray, and }) =>
        and(
          eq(email_domains.organization_id, organization_id),
          inArray(
            email_domains.verification_type,
            EmailDomainApprovedVerificationValues,
          ),
        ),
      columns: {
        domain: true,
      },
    });
  };
}

export type GetDomainsHandler = ReturnType<typeof GetDomains>;
export type GetDomainsDto = Awaited<ReturnType<GetDomainsHandler>>;
