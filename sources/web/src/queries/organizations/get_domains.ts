import { EmailDomainApprovedVerificationValues } from "@proconnect-gouv/proconnect.identite/types";
import { type IdentiteProconnectPgDatabase } from "@~/identite-proconnect/database";

export async function get_domains(
  pg: IdentiteProconnectPgDatabase,
  organization_id: number,
) {
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
}

export type GetDomainsHandler = typeof get_domains;
export type GetDomainsDto = Awaited<ReturnType<GetDomainsHandler>>;
