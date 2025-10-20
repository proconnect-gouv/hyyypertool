//

import app from "@~/app.api";
import config from "@~/app.core/config";
import { LogLevels, consola } from "consola";
import dotenv from "dotenv";
import type { ExecutionContext } from "hono";
import { showRoutes } from "hono/dev";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "util";

//
//
//

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

// Handle -p PORT flag for Scalingo deployment (e.g., bun start -p 23573)
const { values } = parseArgs({
  options: {
    p: {
      type: "string",
    },
  },
  allowPositionals: true,
});

const port = values.p || config.PORT;

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

const appFetch = async (req: Request, env?: object, ctx?: ExecutionContext) => {
  return app.fetch(req, env, ctx);
};

let fetchHandler;
try {
  const { withHtmlLiveReload } = await import("bun-html-live-reload");
  fetchHandler = withHtmlLiveReload(appFetch);
} catch {
  fetchHandler = appFetch;
}

export default {
  fetch: fetchHandler,
  port,
};
