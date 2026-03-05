//

import type { AppEnvContext } from "#src/config";
import { createMiddleware } from "hono/factory";

//

export const cache_immutable = createMiddleware<AppEnvContext>(
  async function immutable_middleware(c, next) {
    await next();
    if (c.finalized) return;
    if (c.env.NODE_ENV === "development") return;
    c.header("cache-control", "public,max-age=31536000,immutable");
  },
);
