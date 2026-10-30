import {
  schema,
  type IdentiteProconnectPgDatabase,
} from "@~/identite-proconnect/database";
import { and, eq } from "drizzle-orm";

export async function remove_user_from_organization(
  pg: IdentiteProconnectPgDatabase,
  { organization_id, user_id }: { organization_id: number; user_id: number },
) {
  return pg
    .delete(schema.users_organizations)
    .where(
      and(
        eq(schema.users_organizations.organization_id, organization_id),
        eq(schema.users_organizations.user_id, user_id),
      ),
    );
}

export type RemoveUserFromOrganizationHandler =
  typeof remove_user_from_organization;
