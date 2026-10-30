import {
  schema,
  type IdentiteProconnectPgDatabase,
} from "@~/identite-proconnect/database";
import { and, eq } from "drizzle-orm";

export async function get_organization_member(
  pg: IdentiteProconnectPgDatabase,
  {
    organization_id,
    user_id,
  }: {
    organization_id: number;
    user_id: number;
  },
) {
  return pg.query.users_organizations.findFirst({
    columns: { is_external: true },
    where: and(
      eq(schema.users_organizations.user_id, user_id),
      eq(schema.users_organizations.organization_id, organization_id),
    ),
  });
}

export type GetOrganizationMemberHandler = typeof get_organization_member;
export type GetOrganizationMemberDto = Awaited<
  ReturnType<GetOrganizationMemberHandler>
>;
