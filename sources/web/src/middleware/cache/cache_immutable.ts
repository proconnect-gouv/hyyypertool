//

import config from "#src/config";
import { createMiddleware } from "hono/factory";

//

export const cache_immutable = createMiddleware(
  async function immutable_middleware(c, next) {
    await next();
    if (c.finalized) return;
    if (config.NODE_ENV === "development") return;
    c.header("cache-control", "public,max-age=31536000,immutable");
  },
);
