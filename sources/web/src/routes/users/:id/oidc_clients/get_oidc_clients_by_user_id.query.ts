//

import type { Pagination } from "#src/schema";
import type { IdentiteProconnectPgDatabase } from "@~/identite-proconnect/database";
import { schema } from "@~/identite-proconnect/database";
import { desc, count as drizzle_count, eq } from "drizzle-orm";

//

export async function get_oidc_clients_by_user_id(
  pg: IdentiteProconnectPgDatabase,
  {
    user_id,
    pagination = { page: 0, page_size: 10 },
  }: {
    user_id: number;
    pagination?: Pagination;
  },
) {
  const { page, page_size: take } = pagination;

  const where = eq(schema.users_oidc_clients.user_id, user_id);

  return pg.transaction(async function connections_with_count(tx) {
    const connections = await tx.query.users_oidc_clients.findMany({
      columns: {
        created_at: true,
        id: true,
        sp_name: true,
      },
      limit: take,
      offset: page * take,
      orderBy: desc(schema.users_oidc_clients.created_at),
      where,
      with: {
        oidc_client: {
          columns: { client_id: true, client_name: true },
        },
        organization: {
          columns: { cached_libelle: true, id: true, siret: true },
        },
      },
    });
    const [{ value: count } = { value: NaN }] = await tx
      .select({ value: drizzle_count() })
      .from(schema.users_oidc_clients)
      .where(where);

    return { connections, count };
  });
}
