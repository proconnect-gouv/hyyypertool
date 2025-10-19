//

import dotenv from "dotenv";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Load environment variables at bin level
const __dirname = dirname(fileURLToPath(import.meta.url));
const binRoot = join(__dirname, "..");

dotenv.config({
  path: [
    join(binRoot, `.env.${process.env.NODE_ENV ?? "development"}.local`),
    join(binRoot, ".env.local"),
    join(binRoot, ".env"),
  ],
});

import app from "@~/app.api";
import config from "@~/app.core/config";
import { LogLevels, consola } from "consola";
import { showRoutes } from "hono/dev";

//
//
//

consola.log("");
consola.log("");
consola.log("# Hyyypertool 🚀 [Bun Runtime]", new Date());
consola.log(Array.from({ length: 42 }).fill("=").join(""));
consola.log("");

const { ALLOWED_USERS, NODE_ENV, DEPLOY_ENV, VERSION, GIT_SHA, TZ } = config;
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
//
//

export default {
  port: config.PORT,
  fetch: app.fetch,
};
