//

import { PaginationSchema } from "#src/schema";
import { z } from "zod";

//

export const query_schema = PaginationSchema.extend({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .catch(undefined),
  live: z.coerce.number().int().min(0).catch(0).default(0),
});
