//

import { schema, type HyyyperPgDatabase } from "@~/hyyyperbase";
import { drizzle } from "drizzle-orm/node-postgres";
import type { Env, MiddlewareHandler } from "hono";
import type { Pool } from "pg";
import pg from "pg";

//

export function set_hyyyperbase_database({
  connectionString,
}: {
  connectionString: string;
}): MiddlewareHandler<Hyyyperbase_Pg_Context> {
  const connection = new pg.Pool({ connectionString });

  return async function set_hyyyperbase_database_middleware({ set }, next) {
    const hyyyper_pg = drizzle(connection, {
      schema,
      logger: process.env["DEPLOY_ENV"] === "preview",
    });

    set("hyyyper_pg", hyyyper_pg);
    set("hyyyper_pg_client", connection);

    await next();
  };
}

//

export interface Hyyyperbase_Pg_Context extends Env {
  Variables: {
    hyyyper_pg_client: Pool;
    hyyyper_pg: HyyyperPgDatabase;
  };
}
