//

import { schema, type HyyyperPgDatabase } from "@~/hyyyperbase";
import { eq } from "drizzle-orm";

//

export async function get_response_template_by_label(
  hyyyper_pg: HyyyperPgDatabase,
  label: string,
) {
  return hyyyper_pg.query.response_templates.findFirst({
    columns: { content: true },
    where: eq(schema.response_templates.label, label),
  });
}
