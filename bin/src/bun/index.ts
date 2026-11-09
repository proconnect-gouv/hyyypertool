//

import { app_env } from "@~/web/config";
import { json_reporter } from "@~/web/log";
import app from "@~/web/routes";
import { LogLevels, consola } from "consola";
import dotenvFlow from "dotenv-flow";
import { showRoutes } from "hono/dev";
import { parseArgs } from "util";

//

consola.setReporters([json_reporter]);
dotenvFlow.config({ default_node_env: "development" });

const config = app_env.parse(process.env);

const { values } = parseArgs({
  options: {
    p: {
      type: "string",
    },
  },
  allowPositionals: true,
});

const port = Number(values.p) || config.PORT;

const { ALLOWED_USERS, DEPLOY_ENV, GIT_SHA, NODE_ENV, TZ, VERSION } = config;
consola.info("Hyyypertool 🚀 [Bun Runtime]", {
  ALLOWED_USERS: ALLOWED_USERS.split(","),
  DEPLOY_ENV,
  GIT_SHA,
  NODE_ENV,
  TZ,
  VERSION,
});

if (consola.level >= LogLevels.debug) {
  showRoutes(app);
  consola.debug("Config", config);
}

//

export default {
  fetch: (req: Request) => app.fetch(req, config),
  port,
};
