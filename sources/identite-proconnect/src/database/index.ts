//

import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import Pg from "pg";
import * as schema from "./drizzle.schema";

//

export { drizzle } from "drizzle-orm/node-postgres";

export { schema };

export type IdentiteProconnectPgDatabase = PgDatabase<
  PgQueryResultHKT,
  typeof schema
>;
export type IdentiteProconnectSdkDatabaseCradle = {
  pg_client: Pg.Pool;
};

export type IdentiteProconnectDatabaseCradle = {
  pg: IdentiteProconnectPgDatabase;
};
export const Pool = Pg.Pool;
