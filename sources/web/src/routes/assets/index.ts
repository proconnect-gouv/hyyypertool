//

import { type AppVariablesContext } from "#src/config";
import { cache_immutable } from "#src/middleware/cache";
import { Hono } from "hono";

//

const serveStatic = globalThis.Bun
  ? (await import("hono/bun")).serveStatic
  : (await import("@hono/node-server/serve-static")).serveStatic;

// Bun production server runs from bin/: node_modules at ../node_modules,
// public files at ./public. Node.js runs from workspace root: node_modules at
// ./node_modules, public files at ./bin/public.
const NODE_MODULES_ROOT = globalThis.Bun ? ".." : ".";
const PUBLIC_ROOT = globalThis.Bun ? "." : "./bin";

//

export type AssetRouterOptions = {
  assets_path: string;
  node_modules_root?: string;
  public_root?: string;
};

export function create_asset_router(opts: AssetRouterOptions) {
  const {
    assets_path,
    node_modules_root = NODE_MODULES_ROOT,
    public_root = PUBLIC_ROOT,
  } = opts;

  const strip_assets_prefix = (path: string) => path.replace(assets_path, "");

  return new Hono<AppVariablesContext>()
    .use("*", cache_immutable)
    .use(
      "/node_modules/*",
      serveStatic({
        rewriteRequestPath: strip_assets_prefix,
        root: node_modules_root,
      }),
    )
    .use(
      "/public/*",
      serveStatic({
        rewriteRequestPath: strip_assets_prefix,
        root: public_root,
      }),
    )
    .use(
      "/src/*",
      serveStatic({
        path: "public/built",
        rewriteRequestPath: (requestPath) => requestPath.replace(/^\/src/, ""),
        root: public_root,
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
}
