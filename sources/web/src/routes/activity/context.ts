//

import { pagination_schema } from "#src/schema";
import { z } from "zod";

//

const PAGE_SIZE = 50;

export const query_schema = pagination_schema({ page_size: PAGE_SIZE }).extend({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .catch(undefined),
  live: z.coerce.number().int().min(0).catch(0).default(0),
});
