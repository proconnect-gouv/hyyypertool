//

import {
  Pool,
  drizzle,
  schema,
  type IdentiteProconnect_PgDatabase,
} from "@~/identite-proconnect/database";
import type { Env, MiddlewareHandler } from "hono";

//

export function set_identite_pg(
  client: IdentiteProconnect_PgDatabase,
): MiddlewareHandler<IdentiteProconnect_Pg_Context> {
  return async function set_identite_pg_middleware({ set }, next) {
    set("identite_pg", client);
    await next();
  };
}

export function set_identite_pg_client(
  client: InstanceType<typeof Pool>,
): MiddlewareHandler<IdentiteProconnect_Pg_Client_Context> {
  return async function set_identite_pg_client_middleware({ set }, next) {
    set("identite_pg_client", client);
    await next();
  };
}

export function set_identite_pg_database({
  connectionString,
}: {
  connectionString: string;
}): MiddlewareHandler<IdentiteProconnect_Pg_Context> {
  const connection = new Pool({ connectionString: connectionString });

  return async function set_identite_pg_database_middleware({ set }, next) {
    const identite_pg = drizzle(connection, {
      schema,
      logger: process.env["DEPLOY_ENV"] === "preview",
    });

    set("identite_pg", identite_pg);
    set("identite_pg_client", connection);

    await next();
  };
}

//

export interface IdentiteProconnect_Pg_Context extends Env {
  Variables: {
    identite_pg_client: InstanceType<typeof Pool>;
    identite_pg: IdentiteProconnect_PgDatabase;
  };
}

export interface IdentiteProconnect_Pg_Client_Context extends Env {
  Variables: {
    identite_pg_client: InstanceType<typeof Pool>;
    identite_pg: IdentiteProconnect_PgDatabase;
  };
}
