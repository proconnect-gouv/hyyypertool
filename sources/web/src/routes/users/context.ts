//

import { PaginationSchema, SearchSchema } from "@~/core/schema";

//

export const query_schema = PaginationSchema.extend(SearchSchema.shape);
