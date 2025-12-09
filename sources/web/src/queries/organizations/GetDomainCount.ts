//

import {
  schema,
  type IdentiteProconnectPgDatabase,
} from "@~/identite-proconnect/database";
import { count as drizzle_count, eq } from "drizzle-orm";

//

export function GetDomainCount(pg: IdentiteProconnectPgDatabase) {
  return async function get_domain_count(organization_id: number) {
    const [{ value: count } = { value: NaN }] = await pg
      .select({ value: drizzle_count() })
      .from(schema.email_domains)
      .innerJoin(
        schema.organizations,
        eq(schema.email_domains.organization_id, schema.organizations.id),
      )
      .where(eq(schema.organizations.id, organization_id));

    return count;
  };
}

export type GetDomainCountHandler = ReturnType<typeof GetDomainCount>;
export type GetDomainCountDto = Awaited<ReturnType<GetDomainCountHandler>>;
