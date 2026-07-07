//

import {
  schema,
  type IdentiteProconnectPgDatabase,
} from "@~/identite-proconnect/database";
import { count as drizzle_count, eq } from "drizzle-orm";

//

export async function count_oidc_clients_by_user_id(
  pg: IdentiteProconnectPgDatabase,
  user_id: number,
) {
  const [{ value: count } = { value: NaN }] = await pg
    .select({ value: drizzle_count() })
    .from(schema.users_oidc_clients)
    .where(eq(schema.users_oidc_clients.user_id, user_id));

  return count;
}
