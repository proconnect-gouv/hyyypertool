//

import type { IdentiteProconnectPgDatabase } from "@~/identite-proconnect/database";
import { schema } from "@~/identite-proconnect/database";
import { desc, eq } from "drizzle-orm";

//

export async function get_oidc_clients_by_user_id(
  pg: IdentiteProconnectPgDatabase,
  user_id: number,
) {
  return pg.query.users_oidc_clients.findMany({
    columns: {
      created_at: true,
      id: true,
      sp_name: true,
    },
    orderBy: desc(schema.users_oidc_clients.created_at),
    where: eq(schema.users_oidc_clients.user_id, user_id),
    with: {
      oidc_client: {
        columns: { client_id: true, client_name: true },
      },
      organization: {
        columns: { cached_libelle: true, id: true, siret: true },
      },
    },
  });
}
