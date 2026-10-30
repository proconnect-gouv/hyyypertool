import {
  schema,
  type IdentiteProconnectPgDatabase,
} from "@~/identite-proconnect/database";
import { count as drizzle_count, eq } from "drizzle-orm";

export async function count_user_memberships(
  pg: IdentiteProconnectPgDatabase,
  user_id: number,
) {
  const [{ value: count } = { value: NaN }] = await pg
    .select({ value: drizzle_count() })
    .from(schema.users_organizations)
    .where(eq(schema.users_organizations.user_id, user_id));

  return count;
}

export type CountUserMembershipsHandler = typeof count_user_memberships;

export type CountUserMembershipsDto = Awaited<
  ReturnType<CountUserMembershipsHandler>
>;
