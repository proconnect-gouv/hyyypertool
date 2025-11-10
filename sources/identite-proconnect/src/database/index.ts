//

import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import Pg from "pg";
import * as schema from "./drizzle.schema";

//

export { drizzle } from "drizzle-orm/node-postgres";
export * from "./types";
export * from "./email_domain";
export { schema };

export type IdentiteProconnect_PgDatabase = PgDatabase<
  PgQueryResultHKT,
  typeof schema
>;
export type IdentiteProconnectSdkDatabaseCradle = {
  pg_client: Pg.Pool;
};

export type IdentiteProconnectDatabaseCradle = {
  pg: IdentiteProconnect_PgDatabase;
};
export const Pool = Pg.Pool;

// Type aliases
import type { EmailDomain_Type } from "./email_domain";
export type EmailDomainVerificationType = EmailDomain_Type;
export type EmailDomain = typeof schema.email_domains.$inferSelect;
