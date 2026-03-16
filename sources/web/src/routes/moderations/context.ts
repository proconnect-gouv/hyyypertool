//

import { PaginationSchema } from "#src/schema";
import { z } from "zod";
import { parse_q } from "./parse_q";

//

export type { Search } from "./parse_q";

export const MODERATION_TABLE_ID = "moderation_table";
export const MODERATION_TABLE_PAGE_ID = "moderation_table_page";

export const search_schema = z.object({
  q: z
    .string()
    .default("is:pending -type:non_verified_domain")
    .transform(parse_q),
});

export const query_schema = search_schema.extend(PaginationSchema.shape);
