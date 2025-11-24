//

import type { IdentiteProconnect_PgDatabase } from "@~/identite-proconnect/database";

//

export async function get_email_deliverability_whitelist(
  pg: IdentiteProconnect_PgDatabase,
) {
  return await pg.query.email_deliverability_whitelist.findMany({
    orderBy: (table, { desc }) => [desc(table.verified_at)],
  });
}
