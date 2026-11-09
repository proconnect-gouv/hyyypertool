//

import { getActiveSpan } from "@sentry/core";
import type { ConsolaReporter, LogType } from "consola";
import { format } from "node:util";

//

const levels = ["trace", "debug", "info", "warn", "error", "fatal"] as const;
type LogLevelName = (typeof levels)[number];

const level_by_type = {
  box: "info",
  debug: "debug",
  error: "error",
  fail: "error",
  fatal: "fatal",
  info: "info",
  log: "info",
  ready: "info",
  silent: "info",
  start: "info",
  success: "info",
  trace: "trace",
  verbose: "trace",
  warn: "warn",
} as const satisfies Record<LogType, LogLevelName>;

//

export function write(level: LogLevelName, fields: Record<string, unknown>) {
  const span_context = getActiveSpan()?.spanContext();
  const line = JSON.stringify({
    level,
    ...fields,
    span_id: span_context?.spanId,
    timestamp: new Date().toISOString(),
    trace_id: span_context?.traceId,
  });
  if (levels.indexOf(level) < levels.indexOf("warn")) console.log(line);
  else console.error(line);
}

function exception_fields(exception: Error) {
  const causes = [];
  for (
    let cause: unknown = exception.cause;
    cause !== undefined && causes.length < 10;
    cause = cause instanceof Error ? cause.cause : undefined
  ) {
    causes.push(
      cause instanceof Error
        ? { message: cause.message, type: cause.name }
        : { message: String(cause) },
    );
  }
  return {
    ...(causes.length > 0 ? { "exception.causes": causes } : {}),
    "exception.message": exception.message,
    "exception.stacktrace": exception.stack,
    "exception.type": exception.name,
  };
}

export const json_reporter: ConsolaReporter = {
  log({ args, type }) {
    const exception = args.find((arg) => arg instanceof Error);
    write(level_by_type[type], {
      ...(exception ? exception_fields(exception) : {}),
      msg: format(...args),
    });
  },
};
