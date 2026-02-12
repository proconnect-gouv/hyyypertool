//

import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import * as schema from "./drizzle.schema";

//

export { schema };

export type IdentiteProconnectPgDatabase = PgDatabase<
  PgQueryResultHKT,
  typeof schema
>;
export type IdentiteProconnectDatabaseCradle = {
  pg: IdentiteProconnectPgDatabase;
};
