//

import {
  Entity_Schema,
  Pagination_Schema,
  Search_Schema,
} from "@~/core/schema";

//

export const query_schema = Pagination_Schema.extend(
  Search_Schema.shape,
).extend(Entity_Schema.partial().shape);
