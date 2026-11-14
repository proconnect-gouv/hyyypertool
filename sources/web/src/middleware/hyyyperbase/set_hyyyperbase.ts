//

import { type HyyyperPgDatabase } from "@~/hyyyperbase";
import type { Env, MiddlewareHandler } from "hono";

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
    hyyyper_pg: HyyyperPgDatabase;
  };
}
