//

import {
  schema,
  type IdentiteProconnectPgDatabase,
} from "@~/identite-proconnect/database";
import { eq } from "drizzle-orm";

//

export async function get_franceconnect_by_user_id(
  pg: IdentiteProconnectPgDatabase,
  id: number,
) {
  return pg.query.franceconnect_userinfo.findFirst({
    columns: {
      created_at: true,
      family_name: true,
      gender: true,
      given_name: true,
      preferred_username: true,
      sub: true,
      updated_at: true,
    },
    where: eq(schema.franceconnect_userinfo.user_id, id),
  });
}
