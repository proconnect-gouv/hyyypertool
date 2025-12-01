//
//

import { buildAllClientScripts } from "@~/config.bun-plugin-client-scripts";
import { $ } from "bun";
import { existsSync } from "node:fs";
import { join } from "node:path";

const minify = true;
const outdir = "./public/built";

// Build Tailwind CSS
const tailwindOutputPath = join(outdir, "tailwind.css");
const isDevMode = import.meta.hot !== undefined;
const shouldSkipBuild = !isDevMode && existsSync(tailwindOutputPath);

if (shouldSkipBuild) {
  console.log("✓ Tailwind CSS already built, skipping...");
  console.log("");
} else {
  console.log("Building Tailwind CSS...");

  await $`./bin/node_modules/.bin/tailwindcss -i sources/web/src/ui/tailwind.css -o bin/public/built/tailwind.css --config bin/tailwind.config.js`.cwd(
    "..",
  );

  console.log("✓ Tailwind CSS built successfully");
  console.log("");
}

// Build client scripts (auto-discovered from bunfig.toml)
await buildAllClientScripts(outdir, { minify });

export {};
