//

import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { z } from "zod";
import * as schema from "./schema";

//

export { schema };

//

export const roles = z.enum(["admin", "moderator", "visitor"]);
export type HyyyperPgDatabase = PgDatabase<PgQueryResultHKT, typeof schema>;
export type HyyyperbaseDatabaseCradle = {
  hyyyper_pg: HyyyperPgDatabase;
};
export type Roles = z.infer<typeof roles>;
