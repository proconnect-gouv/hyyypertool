//

import { plugin } from "bun";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

//

const SHIM = join(import.meta.dir, "hono_jsx_preact_shim.ts");

// The client build turns templates written for hono into preact
// (`hono_jsx_to_preact`); `bun test` does not bundle, so an island's test
// would render hono elements with preact. One process keeps one copy of each
// module, so island tests run on their own (`test:islands`): when the run
// starts on an island test (`*.client.test.tsx`), every template without a
// JSX pragma loads as preact; any other run keeps hono.
if (/\.client\.test\.tsx?$/.test(Bun.main)) {
  plugin({
    name: "preact-shared-templates",
    setup(build) {
      build.onLoad(
        { filter: /\/sources\/web\/src\/.+\.tsx$/ },
        async ({ path }) => {
          const source = await readFile(path, "utf8");
          if (source.includes("@jsxImportSource"))
            return { contents: source, loader: "tsx" };
          return {
            contents:
              "/** @jsxImportSource preact */\n" +
              source.replace(
                /from\s+["']hono\/jsx["']/g,
                `from ${JSON.stringify(SHIM)}`,
              ),
            loader: "tsx",
          };
        },
      );
    },
  });
}
