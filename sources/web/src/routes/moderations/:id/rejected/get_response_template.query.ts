//

import { schema, type HyyyperPgDatabase } from "@~/hyyyperbase";
import { eq } from "drizzle-orm";

//

export async function get_response_template(pg: HyyyperPgDatabase, id: number) {
  return pg.query.response_templates.findFirst({
    columns: { content: true, end_user_reason: true },
    where: eq(schema.response_templates.id, id),
  });
}
