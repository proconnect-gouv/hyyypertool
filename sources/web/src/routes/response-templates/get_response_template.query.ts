//

import { schema, type HyyyperPgDatabase } from "@~/hyyyperbase";
import { eq } from "drizzle-orm";

//

export async function get_response_template(
  hyyyper_pg: HyyyperPgDatabase,
  id: number,
) {
  return hyyyper_pg.query.response_templates.findFirst({
    where: eq(schema.response_templates.id, id),
  });
}
