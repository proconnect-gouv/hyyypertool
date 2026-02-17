//

import * as Sentry from "@sentry/browser";

//

const dsn = document.querySelector<HTMLMetaElement>(
  'meta[name="sentry-dsn"]',
)?.content;
const environment = document.querySelector<HTMLMetaElement>(
  'meta[name="sentry-environment"]',
)?.content;
const release = document.querySelector<HTMLMetaElement>(
  'meta[name="sentry-release"]',
)?.content;
const tracesSampleRate = Number(
  document.querySelector<HTMLMetaElement>(
    'meta[name="sentry-traces-sample-rate"]',
  )?.content ?? "1",
);

if (dsn) {
  Sentry.init({
    dsn,
    environment,
    release,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate,
  });
}
