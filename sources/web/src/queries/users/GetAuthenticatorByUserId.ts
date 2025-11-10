//

import {
  schema,
  type IdentiteProconnect_PgDatabase,
} from "@~/identite-proconnect/database";
import { eq } from "drizzle-orm";

//

export function GetAuthenticatorByUserId(pg: IdentiteProconnect_PgDatabase) {
  return async function get_authenticators_by_user_id(id: number) {
    return pg.query.authenticators.findMany({
      columns: {
        created_at: true,
        credential_id: true,
        display_name: true,
        last_used_at: true,
        usage_count: true,
      },
      where: eq(schema.authenticators.user_id, id),
    });
  };
}

export type get_authenticators_by_user_id_dto = Awaited<
  ReturnType<typeof GetAuthenticatorByUserId>
>;
