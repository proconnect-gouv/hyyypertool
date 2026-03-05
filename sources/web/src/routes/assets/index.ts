//

import { type AppVariablesContext } from "#src/config";
import { cache_immutable } from "#src/middleware/cache";
import { Hono } from "hono";
import { rewriteAssetRequestPath } from "./rewrite";

//

// Runtime-agnostic serveStatic: use Bun or Node.js adapter based on runtime
const serveStatic = globalThis.Bun
  ? (await import("hono/bun")).serveStatic
  : (await import("@hono/node-server/serve-static")).serveStatic;

// Determine the root path for static files
// For Bun: Server runs from bin/ directory:
//   - node_modules are at ../node_modules/ (workspace root) - use ".." as root
//   - public files are at ./public/ (bin/public) - use "." as root
// For Node.js: Server runs from workspace root:
//   - node_modules are at ./node_modules/ (workspace root) - use "." as root
//   - public files are at ./bin/public/ - use "./bin" as root
const nodeModulesRoot = globalThis.Bun ? ".." : ".";
const publicRoot = globalThis.Bun ? "." : "./bin";

//

export default new Hono<AppVariablesContext>()
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
  .use(
    "/src/*",
    serveStatic({
      root: publicRoot,
      path: "public/built",
      rewriteRequestPath: (requestPath) => requestPath.replace(/^\/src/, ""),
    }),
  )
  .get(
    "/bundle/config.js",
    async ({ text, env: { ASSETS_PATH, PUBLIC_ASSETS_PATH, VERSION } }) => {
      return text(
        `export default ${JSON.stringify({ ASSETS_PATH, PUBLIC_ASSETS_PATH, VERSION })}`,
        200,
        {
          "content-type": "text/javascript",
        },
      );
    },
  )
  .get("/bundle/env.js", async ({ text, env: { VERSION } }) => {
    return text(`export default ${JSON.stringify({ VERSION })}`, 200, {
      "content-type": "text/javascript",
    });
  });
