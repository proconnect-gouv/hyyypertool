//

import type { MiddlewareHandler } from "hono";
import type { Pool } from "pg";
import { RateLimiterPostgres } from "rate-limiter-flexible";

//

interface RateLimitOptions {
  storeClient: Pool;
  storeType?: string;
  points?: number;
  duration?: number;
  tableName?: string;
}

export function rate_limit({
  storeClient,
  storeType,
  points = 60,
  duration = 60,
  tableName = "rate_limiter",
}: RateLimitOptions): MiddlewareHandler {
  const limiter = new RateLimiterPostgres({
    storeClient,
    storeType,
    tableName,
    points,
    duration,
    tableCreated: true,
  });

  return async function rate_limit_middleware(c, next) {
    const ip =
      c.req.header("x-forwarded-for")?.split(",").at(0)?.trim() ??
      c.req.header("x-real-ip") ??
      "unknown";

    try {
      await limiter.consume(ip);
    } catch {
      return c.text("Too Many Requests", 429, {
        "Retry-After": String(duration),
        "X-RateLimit-Limit": String(points),
        "X-RateLimit-Remaining": "0",
      });
    }

    return next();
  };
}
