//

import {
  schema,
  type IdentiteProconnectDatabaseCradle,
} from "@~/identite-proconnect/database";
import { count as drizzle_count, eq } from "drizzle-orm";

//

export function CountUserMemberships({ pg }: IdentiteProconnectDatabaseCradle) {
  return async function count_user_merbership(user_id: number) {
    const [{ value: count }] = await pg
      .select({ value: drizzle_count() })
      .from(schema.users_organizations)
      .where(eq(schema.users_organizations.user_id, user_id));

    return count;
  };
}

export type CountUserMembershipsHandler = ReturnType<
  typeof CountUserMemberships
>;

export type count_user_merbership_dto = Awaited<
  ReturnType<CountUserMembershipsHandler>
>;
