//

import type { HyyyperPgDatabase } from "@~/hyyyperbase";

//

export async function get_response_templates(
  pg: HyyyperPgDatabase,
  search_term: string,
) {
  return pg.query.response_templates.findMany({
    columns: {
      content: true,
      id: true,
      label: true,
      created_at: true,
      updated_at: true,
    },
    where: (table, { or, ilike }) =>
      or(
        ilike(table.content, "%" + search_term + "%"),
        ilike(table.label, "%" + search_term + "%"),
      ),
  });
}
