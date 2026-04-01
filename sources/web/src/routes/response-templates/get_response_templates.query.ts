//

import { schema, type HyyyperPgDatabase } from "@~/hyyyperbase";
import { asc, desc } from "drizzle-orm";

//

export async function get_response_templates(hyyyper_pg: HyyyperPgDatabase) {
  return hyyyper_pg
    .select()
    .from(schema.response_templates)
    .orderBy(
      desc(schema.response_templates.updated_at),
      asc(schema.response_templates.label),
    );
}
