//

import type { HyyyperPgDatabase } from "@~/hyyyperbase";

//

export async function get_response_template(pg: HyyyperPgDatabase, id: number) {
  return pg.query.response_templates.findFirst({
    columns: {
      content: true,
      id: true,
      label: true,
      created_at: true,
      updated_at: true,
    },
    where: (table, { eq }) => eq(table.id, id),
  });
}
