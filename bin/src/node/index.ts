//

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { serve } from "@hono/node-server";
import { app_env } from "@~/web/config";
import { json_reporter } from "@~/web/log";
import app from "@~/web/routes";
import { execSync } from "child_process";
import { LogLevels, consola } from "consola";
import { existsSync } from "fs";
import { showRoutes } from "hono/dev";

//
//
//

consola.setReporters([json_reporter]);

const __dirname = dirname(fileURLToPath(import.meta.url));
const binRoot = join(__dirname, "..", "..");

if (!existsSync(join(binRoot, "public/built"))) {
  console.log("Building static files...");
  execSync("bun run ./build.ts", { stdio: "inherit", cwd: binRoot });
  console.log("✓ Static files built successfully");
}

execSync("bun run migrate", {
  stdio: "inherit",
  cwd: join(binRoot, "../sources/hyyyperbase"),
});

//
//
//

const config = app_env.parse(process.env);

const {
  ALLOWED_USERS,
  DEPLOY_ENV,
  GIT_SHA,
  HYYYPERBASE_ADMIN,
  NODE_ENV,
  TZ,
  VERSION,
} = config;
consola.info("Hyyypertool 🚀", {
  ALLOWED_USERS: ALLOWED_USERS.split(","),
  DEPLOY_ENV,
  GIT_SHA,
  HYYYPERBASE_ADMIN,
  NODE_ENV,
  TZ,
  VERSION,
});

if (consola.level >= LogLevels.debug) {
  showRoutes(app);
  consola.debug("Config", config);
}

//
//
//

serve({
  fetch: (req) => app.fetch(req, config),
  port: config.PORT,
});
