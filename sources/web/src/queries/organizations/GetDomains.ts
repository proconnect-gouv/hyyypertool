//

import { type IdentiteProconnect_PgDatabase } from "@~/identite-proconnect/database";

//

export function GetDomains(pg: IdentiteProconnect_PgDatabase) {
  return async function get_domains(organization_id: number) {
    return pg.query.email_domains.findMany({
      where: (email_domains, { eq }) =>
        eq(email_domains.organization_id, organization_id),
      columns: {
        domain: true,
      },
    });
  };
}

export type GetDomainsHandler = ReturnType<typeof GetDomains>;
export type GetDomainsDto = Awaited<ReturnType<GetDomainsHandler>>;
