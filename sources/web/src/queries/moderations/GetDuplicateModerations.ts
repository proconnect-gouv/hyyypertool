//

import {
  schema,
  type IdentiteProconnect_PgDatabase,
} from "@~/identite-proconnect.database";
import { and, asc, eq } from "drizzle-orm";

//

export function GetDuplicateModerations(pg: IdentiteProconnect_PgDatabase) {
  return async function get_duplicate_moderations({
    organization_id,
    user_id,
  }: {
    organization_id: number;
    user_id: number;
  }) {
    return pg
      .select()
      .from(schema.moderations)
      .where(
        and(
          eq(schema.moderations.organization_id, organization_id),
          eq(schema.moderations.user_id, user_id),
        ),
      )
      .orderBy(asc(schema.moderations.created_at));
  };
}

export type GetDuplicateModerationsHandler = ReturnType<
  typeof GetDuplicateModerations
>;
export type GetDuplicateModerationsDto = Awaited<
  ReturnType<GetDuplicateModerationsHandler>
>;
