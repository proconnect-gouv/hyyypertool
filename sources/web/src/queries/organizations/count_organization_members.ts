import {
  schema,
  type IdentiteProconnectPgDatabase,
} from "@~/identite-proconnect/database";
import { count as drizzle_count, eq } from "drizzle-orm";

export async function count_organization_members(
  pg: IdentiteProconnectPgDatabase,
  { organization_id }: { organization_id: number },
) {
  const [{ value: count } = { value: NaN }] = await pg
    .select({ value: drizzle_count() })
    .from(schema.users_organizations)
    .where(eq(schema.users_organizations.organization_id, organization_id));

  return count;
}

export type CountOrganizationMembersHandler = typeof count_organization_members;
export type CountOrganizationMembersDto = Awaited<
  ReturnType<CountOrganizationMembersHandler>
>;
