//

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { serve } from "@hono/node-server";
import { app_env } from "@~/web/config";
import app from "@~/web/routes";
import { execSync } from "child_process";
import { LogLevels, consola } from "consola";
import { existsSync } from "fs";
import { showRoutes } from "hono/dev";

//
//
//

const __dirname = dirname(fileURLToPath(import.meta.url));
const binRoot = join(__dirname, "..", "..");

if (!existsSync(join(binRoot, "public/built"))) {
  console.log("Building static files...");
  execSync("bun run ./build.ts", { stdio: "inherit", cwd: binRoot });
  console.log("✓ Static files built successfully");
}

//
//
//

consola.log("");
consola.log("");
consola.log("# Hyyypertool 🚀", new Date());
consola.log(Array.from({ length: 42 }).fill("=").join(""));
consola.log("");

const config = app_env.parse(process.env);

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

serve({
  fetch: (req) => app.fetch(req, config),
  port: config.PORT,
});
