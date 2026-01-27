//

import {
  DescribedBySchema,
  EntitySchema,
  PaginationSchema,
} from "@~/core/schema";
import { z } from "zod";

//

export const QuerySchema = PaginationSchema.merge(DescribedBySchema).extend({
  page_ref: z.string(),
});

export const ParamSchema = EntitySchema;
