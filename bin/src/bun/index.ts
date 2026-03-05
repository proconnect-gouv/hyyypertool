//

import { app_env } from "@~/web/config";
import app from "@~/web/routes";
import { LogLevels, consola } from "consola";
import dotenvFlow from "dotenv-flow";
import { showRoutes } from "hono/dev";
import { parseArgs } from "util";

//

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

consola.log("");
consola.log("");
consola.log("# Hyyypertool 🚀 [Bun Runtime]", new Date());
consola.log(Array.from({ length: 42 }).fill("=").join(""));
consola.log("");

const {
  ADMIN_EMAILS,
  ALLOWED_USERS,
  NODE_ENV,
  DEPLOY_ENV,
  VERSION,
  GIT_SHA,
  TZ,
} = config;
consola.log("");
consola.log("");
consola.log("┌─── ENV");
if (consola.level >= LogLevels.log) {
  console.table({ NODE_ENV, DEPLOY_ENV, VERSION, GIT_SHA, TZ });
}

consola.log("");
consola.log("");
consola.log("┌─── ALLOWED_USERS");
if (consola.level >= LogLevels.log) {
  console.table(ALLOWED_USERS.split(","));
}

consola.log("┌─── ADMIN_EMAILS");
if (consola.level >= LogLevels.log) {
  console.table(ADMIN_EMAILS.split(","));
}

if (consola.level >= LogLevels.debug) {
  consola.debug("");
  consola.debug("");
  consola.debug("┌─── Routes");
  showRoutes(app);

  consola.debug("");
  consola.debug("");
  consola.debug("┌─── Config");
  consola.debug(config);
}

//

export default {
  fetch: (req: Request) => app.fetch(req, config),
  port,
};
