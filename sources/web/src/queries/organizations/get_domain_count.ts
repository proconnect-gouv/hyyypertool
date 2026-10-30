import {
  schema,
  type IdentiteProconnectPgDatabase,
} from "@~/identite-proconnect/database";
import { count as drizzle_count, eq } from "drizzle-orm";

export async function get_domain_count(
  pg: IdentiteProconnectPgDatabase,
  organization_id: number,
) {
  const [{ value: count } = { value: NaN }] = await pg
    .select({ value: drizzle_count() })
    .from(schema.email_domains)
    .innerJoin(
      schema.organizations,
      eq(schema.email_domains.organization_id, schema.organizations.id),
    )
    .where(eq(schema.organizations.id, organization_id));

  return count;
}

export type GetDomainCountHandler = typeof get_domain_count;
export type GetDomainCountDto = Awaited<ReturnType<GetDomainCountHandler>>;
