import {
  SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN,
  SEMANTIC_ATTRIBUTE_SENTRY_SOURCE,
  Scope,
  continueTrace,
  getGlobalScope,
  getTraceMetaTags,
  setHttpStatus,
  startSpan,
  withScope,
} from "@sentry/core";
import type { Env } from "hono";
import { createMiddleware } from "hono/factory";

//

export interface SentryVariablesContext extends Env {
  Variables: {
    sentry: Scope;
    sentry_trace_meta_tags: string;
  };
}

//

export function set_sentry() {
  return createMiddleware(async function sentry_middleware(c, next) {
    if (
      c.req.method.toUpperCase() === "OPTIONS" ||
      c.req.method.toUpperCase() === "HEAD"
    ) {
      c.set("sentry_trace_meta_tags", getTraceMetaTags());
      c.set("sentry", getGlobalScope());
      return next();
    }

    return withScope(function with_scope_callback(scope) {
      const sentryTrace = c.req.header("sentry-trace")
        ? c.req.header("sentry-trace")
        : undefined;
      const baggage = c.req.header("baggage");
      const { url, method, path } = c.req;

      const headers: Record<string, string> = {};
      c.res.headers.forEach((value, key) => {
        headers[key] = value;
      });

      scope.setTransactionName(`${method} ${path}`);
      scope.setSDKProcessingMetadata({
        request: {
          url,
          method,
          headers,
        },
      });

      return continueTrace(
        { sentryTrace, baggage },
        function continue_trace_callback() {
          return startSpan(
            {
              attributes: {
                [SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.http.node",
                "http.request.method": c.req.method || "GET",
                [SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: "url",
              },
              op: "http.server",
              name: `${c.req.method} ${c.req.path || "/"}`,
            },
            async function start_span_callback(span) {
              c.set("sentry_trace_meta_tags", getTraceMetaTags());
              c.set("sentry", scope);

              await next();

              if (!span) {
                return;
              }

              setHttpStatus(span, c.res.status);
              scope.setContext("response", {
                headers,
                status_code: c.res.status,
              });
            },
          );
        },
      );
    });
  });
}
