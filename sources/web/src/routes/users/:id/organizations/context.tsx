//

import {
  DescribedBy_Schema,
  Entity_Schema,
  Pagination_Schema,
} from "@~/core/schema";
import { z } from "zod/v4";

//

export const QuerySchema = Pagination_Schema.merge(DescribedBy_Schema).extend({
  page_ref: z.string(),
});

export const ParamSchema = Entity_Schema;
