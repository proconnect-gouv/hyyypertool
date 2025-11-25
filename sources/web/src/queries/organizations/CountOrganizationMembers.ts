//

import {
  schema,
  type IdentiteProconnectPgDatabase,
} from "@~/identite-proconnect/database";
import { count as drizzle_count, eq } from "drizzle-orm";

//

export function CountOrganizationMembers(pg: IdentiteProconnectPgDatabase) {
  return async function count_organization_members({
    organization_id,
  }: {
    organization_id: number;
  }) {
    const [{ value: count }] = await pg
      .select({ value: drizzle_count() })
      .from(schema.users_organizations)
      .where(eq(schema.users_organizations.organization_id, organization_id));

    return count;
  };
}

export type CountOrganizationMembersHandler = ReturnType<
  typeof CountOrganizationMembers
>;
export type CountOrganizationMembersDto = Awaited<
  ReturnType<CountOrganizationMembersHandler>
>;
