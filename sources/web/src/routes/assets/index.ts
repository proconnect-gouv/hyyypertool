//

import { type AppVariables_Context } from "#src/config";
import { cache_immutable } from "#src/middleware/cache/cache_immutable";
import { Hono } from "hono";
import { rewriteAssetRequestPath } from "./rewrite";
import zammad_attachment_router from "./zammad";

//

// Runtime-agnostic serveStatic: use Bun or Node.js adapter based on runtime
const serveStatic = globalThis.Bun
  ? (await import("hono/bun")).serveStatic
  : (await import("@hono/node-server/serve-static")).serveStatic;

// Determine the root path for static files
// Server runs from bin/ directory:
// - node_modules are at ../node_modules/ (workspace root) - use ".." as root
// - public files are at ./public/ (bin/public) - use "." as root
// For Node.js: default behavior works (no root specified)
const nodeModulesRoot = globalThis.Bun ? ".." : undefined;
const publicRoot = globalThis.Bun ? "." : undefined;

//

export default new Hono<AppVariables_Context>()
  .use("*", cache_immutable)
  .use(
    "/node_modules/*",
    serveStatic({
      root: nodeModulesRoot,
      rewriteRequestPath: rewriteAssetRequestPath,
    }),
  )
  .use(
    "/public/*",
    serveStatic({
      root: publicRoot,
      rewriteRequestPath: rewriteAssetRequestPath,
    }),
  )
  .get("/bundle/config.js", async ({ text, var: { config } }) => {
    const { ASSETS_PATH, PUBLIC_ASSETS_PATH, VERSION } = config;
    return text(
      `export default ${JSON.stringify({ ASSETS_PATH, PUBLIC_ASSETS_PATH, VERSION })}`,
      200,
      {
        "content-type": "text/javascript",
      },
    );
  })
  .get("/bundle/env.js", async ({ text, var: { config } }) => {
    const { VERSION } = config;
    return text(`export default ${JSON.stringify({ VERSION })}`, 200, {
      "content-type": "text/javascript",
    });
  })
  .route("/zammad", zammad_attachment_router);
