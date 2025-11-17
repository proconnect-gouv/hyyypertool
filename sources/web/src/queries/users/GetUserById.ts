//

import { NotFoundError } from "#src/errors";
import {
  schema,
  type IdentiteProconnect_PgDatabase,
} from "@~/identite-proconnect/database";
import { eq } from "drizzle-orm";

//
type UserQueryConfigColumns = Partial<
  Record<keyof typeof schema.users._.columns, true>
>;

export function GetUserById<TColumns extends UserQueryConfigColumns>({
  columns,
}: {
  columns: TColumns;
}) {
  return async function get_user_by_id(
    pg: IdentiteProconnect_PgDatabase,
    id: number,
  ) {
    const user = await pg.query.users.findFirst({
      columns,
      where: eq(schema.users.id, id),
    });

    if (!user) throw new NotFoundError("User not found.");

    return user;
  };
}
