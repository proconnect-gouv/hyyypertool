//

import {
  schema,
  type IdentiteProconnectDatabaseCradle,
} from "@~/identite-proconnect.database";
import { and, eq } from "drizzle-orm";

//

export function IsUserExternalMember({ pg }: IdentiteProconnectDatabaseCradle) {
  return async function is_user_external_member({
    organization_id,
    user_id,
  }: {
    user_id: number;
    organization_id: number;
  }) {
    const user_organization = await pg.query.users_organizations.findFirst({
      columns: { is_external: true },
      where: and(
        eq(schema.users_organizations.user_id, user_id),
        eq(schema.users_organizations.organization_id, organization_id),
      ),
    });

    return user_organization?.is_external ?? false;
  };
}

export type IsUserExternalMemberHandler = ReturnType<
  typeof IsUserExternalMember
>;
export type IsUserExternalMemberOutput = Awaited<
  ReturnType<IsUserExternalMemberHandler>
>;
