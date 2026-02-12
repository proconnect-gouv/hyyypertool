//

import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { z } from "zod";
import * as schema from "./schema";

//

export { as_user } from "./as_user";
export { schema };

//

export const roles = z.enum(["admin", "god", "moderator", "visitor"]);
export type HyyyperPgDatabase = PgDatabase<PgQueryResultHKT, typeof schema>;
export type HyyyperbaseDatabaseCradle = {
  hyyyper_pg: HyyyperPgDatabase;
};
export type Roles = z.infer<typeof roles>;
