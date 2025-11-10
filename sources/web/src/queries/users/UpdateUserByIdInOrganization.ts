//

import {
  schema,
  type IdentiteProconnect_PgDatabase,
  type Writable_Users_Organizations,
} from "@~/identite-proconnect/database";
import { and, eq } from "drizzle-orm";

//

export function UpdateUserByIdInOrganization({
  pg,
}: {
  pg: IdentiteProconnect_PgDatabase;
}) {
  return async function update_user_by_id_in_organization(
    { organization_id, user_id }: { organization_id: number; user_id: number },
    values: Writable_Users_Organizations,
  ) {
    await pg
      .update(schema.users_organizations)
      .set({ ...values, updated_at: new Date().toISOString() })
      .where(
        and(
          eq(schema.users_organizations.organization_id, organization_id),
          eq(schema.users_organizations.user_id, user_id),
        ),
      );
  };
}

export type UpdateUserByIdInOrganizationHandler = ReturnType<
  typeof UpdateUserByIdInOrganization
>;
