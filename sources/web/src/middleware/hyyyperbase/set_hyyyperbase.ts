//

import { type HyyyperPgDatabase } from "@~/hyyyperbase";
import type { Env, MiddlewareHandler } from "hono";
import type { Pool } from "pg";

//

export function set_hyyyper_pg(
  hyyyper_pg: HyyyperPgDatabase,
): MiddlewareHandler<HyyyperbasePgContext> {
  return async function set_hyyyper_pg_middleware({ set }, next) {
    set("hyyyper_pg", hyyyper_pg);
    await next();
  };
}

//

export interface HyyyperbasePgContext extends Env {
  Variables: {
    hyyyper_pg_client: Pool;
    hyyyper_pg: HyyyperPgDatabase;
  };
}
