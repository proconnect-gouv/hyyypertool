//

import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import dotenvFlow from "dotenv-flow";

//

dotenvFlow.config({ default_node_env: "development" });

const config = (await import("@~/web/config")).default;

Sentry.init({
  enabled: config.NODE_ENV === "production",
  attachStacktrace: true,
  dsn: config.SENTRY_DNS,
  environment: config.DEPLOY_ENV,
  initialScope: {
    tags: {
      NODE_ENV: config.NODE_ENV,
      HOST: config.HOST,
      GIT_SHA: config.GIT_SHA,
    },
  },
  integrations: [
    nodeProfilingIntegration(),
    Sentry.postgresIntegration(),
    Sentry.httpIntegration(),
  ],
  profilesSampleRate: config.SENTRY_PROFILES_SAMPLE_RATE,
  release: config.VERSION,
  tracesSampleRate: config.SENTRY_TRACES_SAMPLE_RATE,
});
