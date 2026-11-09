//

import { write } from "#src/lib/log";
import consola, { LogLevels } from "consola";
import { createMiddleware } from "hono/factory";

//

export function log_request() {
  return createMiddleware(async function log_request_middleware(c, next) {
    const start = performance.now();
    await next();
    if (consola.level < LogLevels.info) return;
    const { pathname, search } = new URL(c.req.url);
    const content_length = c.res.headers.get("content-length");
    write("info", {
      duration_ms: Math.round(performance.now() - start),
      event: "http.request.completed",
      "http.request.header.referer": c.req.header("referer"),
      "http.request.method": c.req.method,
      "http.response.body.size": content_length
        ? Number(content_length)
        : undefined,
      "http.response.status_code": c.res.status,
      url: pathname + search,
      "user_agent.original": c.req.header("user-agent"),
    });
  });
}
