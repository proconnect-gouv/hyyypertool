//

import { PaginationSchema, SearchSchema } from "#src/schema";

//

export const query_schema = PaginationSchema.extend(SearchSchema.shape);
