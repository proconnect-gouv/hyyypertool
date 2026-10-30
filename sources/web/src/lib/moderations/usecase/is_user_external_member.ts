import {
  schema,
  type IdentiteProconnectPgDatabase,
} from "@~/identite-proconnect/database";
import { and, eq } from "drizzle-orm";

export async function is_user_external_member(
  pg: IdentiteProconnectPgDatabase,
  {
    organization_id,
    user_id,
  }: {
    organization_id: number;
    user_id: number;
  },
) {
  const user_organization = await pg.query.users_organizations.findFirst({
    columns: { is_external: true },
    where: and(
      eq(schema.users_organizations.user_id, user_id),
      eq(schema.users_organizations.organization_id, organization_id),
    ),
  });

  return user_organization?.is_external ?? false;
}

export type IsUserExternalMemberHandler = typeof is_user_external_member;
export type IsUserExternalMemberOutput = Awaited<
  ReturnType<IsUserExternalMemberHandler>
>;
