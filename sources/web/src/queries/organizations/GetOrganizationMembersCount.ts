//

import {
  schema,
  type IdentiteProconnectPgDatabase,
} from "@~/identite-proconnect/database";
import { count as drizzle_count, eq } from "drizzle-orm";

//

export function GetOrganizationMembersCount(pg: IdentiteProconnectPgDatabase) {
  return async function get_organization_members_count(
    organization_id: number,
  ) {
    const [{ value: count } = { value: NaN }] = await pg
      .select({ value: drizzle_count() })
      .from(schema.users_organizations)
      .where(eq(schema.users_organizations.organization_id, organization_id));

    return count;
  };
}

export type GetOrganizationMembersCountHandler = ReturnType<
  typeof GetOrganizationMembersCount
>;
export type GetOrganizationMembersCountDto = Awaited<
  ReturnType<GetOrganizationMembersCountHandler>
>;
