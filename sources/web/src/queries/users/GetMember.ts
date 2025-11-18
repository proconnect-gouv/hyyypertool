//

import { NotFoundError } from "#src/errors";
import {
  schema,
  type IdentiteProconnect_PgDatabase,
} from "@~/identite-proconnect/database";
import { and, eq } from "drizzle-orm";

//
type UsersOrganizationsColumns =
  keyof typeof schema.users_organizations._.columns;

export function GetMember<
  TColumns extends Partial<Record<UsersOrganizationsColumns, true>>,
>({ pg, columns }: { pg: IdentiteProconnect_PgDatabase; columns: TColumns }) {
  return async function get_member_by_id({
    organization_id,
    user_id,
  }: {
    organization_id: number;
    user_id: number;
  }) {
    const member = await pg.query.users_organizations.findFirst({
      columns,
      where: and(
        eq(schema.users_organizations.organization_id, organization_id),
        eq(schema.users_organizations.user_id, user_id),
      ),
    });

    if (!member) throw new NotFoundError("Member not found.");

    return member;
  };
}

export type GetMemberHandler<
  TColumns extends Partial<Record<UsersOrganizationsColumns, true>>,
> = ReturnType<typeof GetMember<TColumns>>;
