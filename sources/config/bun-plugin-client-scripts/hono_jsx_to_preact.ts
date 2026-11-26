//

import type { BunPlugin } from "bun";
import { join } from "path";

//

// A component without a JSX pragma compiles against `hono/jsx` (the web
// tsconfig). Bundled into an island, it must build preact elements instead,
// so the client build points the hono JSX runtime and hooks at preact.
//
// A template shared this way keeps to what both runtimes do the same: no
// pragma, hooks only from `hono_jsx_preact_shim.ts`, no `raw()`, no async
// component, no `useRequestContext`, and `children` typed `unknown`, since
// `tsc` checks it against hono's JSX types only. Island tests get the same
// mapping from `preact_shared_templates.ts`, through `bun run test:islands`.
export const hono_jsx_to_preact: BunPlugin = {
  name: "hono-jsx-to-preact",
  setup(build) {
    build.onResolve({ filter: /^hono\/jsx\/jsx-(dev-)?runtime$/ }, (args) => ({
      external: true,
      path: args.path.replace("hono/jsx", "preact"),
    }));
    build.onResolve({ filter: /^hono\/jsx$/ }, () => ({
      path: join(import.meta.dir, "hono_jsx_preact_shim.ts"),
    }));
  },
};
