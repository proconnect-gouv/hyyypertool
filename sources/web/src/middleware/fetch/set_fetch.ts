//

import type { Env, MiddlewareHandler } from "hono";

//

export function set_fetch(
  value?: () => Promise<Response> | typeof fetch,
): MiddlewareHandler<FetchVariables_Context> {
  return async function set_fetch_middleware({ set }, next) {
    set("fetch", (value as any) ?? globalThis.fetch);
    await next();
  };
}

//

export interface FetchVariables_Context extends Env {
  Variables: {
    readonly fetch: typeof fetch;
  };
}
