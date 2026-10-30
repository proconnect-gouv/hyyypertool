//

import { PaginationSchema } from "#src/schema";
import { z } from "zod";

//

export const query_schema = PaginationSchema.extend({
  live: z.coerce.number().int().min(0).catch(0).default(0),
});
