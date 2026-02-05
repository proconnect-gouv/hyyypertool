//

import {
  buildClientScripts,
  discoverClientScripts,
  loadClientScriptPatterns,
  loadExternalDependencies,
} from "@~/config.bun-plugin-client-scripts";
import { $ } from "bun";
import { join } from "path";

//

const PROJECT_ROOT = join(import.meta.dir, "..");
const OUTDIR = join(PROJECT_ROOT, "bin/public/built");

const c = {
  cyan: (t: string) => `\x1b[36m${t}\x1b[0m`,
  magenta: (t: string) => `\x1b[35m${t}\x1b[0m`,
  green: (t: string) => `\x1b[32m${t}\x1b[0m`,
};

//

const patterns = await loadClientScriptPatterns();
const external = await loadExternalDependencies();

if (patterns.length > 0) {
  console.log(`[${c.cyan("client")}] Building...`);
  const entrypoints = await discoverClientScripts(patterns);

  await buildClientScripts(entrypoints, OUTDIR, {
    minify: true,
    sourcemap: "external",
    external,
  });
  console.log(`[${c.cyan("client")}] Done`);
} else {
  console.log(`[${c.cyan("client")}] No patterns configured`);
}

console.log(`[${c.magenta("tailwind")}] Building...`);
await $`./bin/node_modules/.bin/tailwindcss -i sources/web/src/ui/tailwind.css -o bin/public/built/tailwind.css --config bin/tailwind.config.js --minify`
  .cwd(PROJECT_ROOT)
  .quiet();
console.log(`[${c.magenta("tailwind")}] Done`);

console.log(`\n${c.green("Build complete!")}`);
