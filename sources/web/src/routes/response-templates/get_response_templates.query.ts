//

import { schema, type HyyyperPgDatabase } from "@~/hyyyperbase";
import { asc } from "drizzle-orm";

//

export type ResponseTemplateDto = Awaited<
  ReturnType<typeof get_response_templates>
>[number];

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
      end_user_reason: true,
      allow_editing: true,
    },
    orderBy: asc(schema.response_templates.label),
    where: (table, { or, ilike }) =>
      or(
        ilike(table.content, "%" + search_term + "%"),
        ilike(table.label, "%" + search_term + "%"),
      ),
  });
}
