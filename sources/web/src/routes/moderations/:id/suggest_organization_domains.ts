import { get_domains } from "#src/queries/organizations";
import type { IdentiteProconnectPgDatabase } from "@~/identite-proconnect/database";

export async function suggest_organization_domains(
  pg: IdentiteProconnectPgDatabase,
  organization_id: number,
) {
  const domains = await get_domains(pg, organization_id);
  return domains.map(({ domain }) => domain);
}
