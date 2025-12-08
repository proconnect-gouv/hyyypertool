/**
 * Production build script
 *
 * Builds all assets for production:
 * - Client scripts (*.client.ts) with minification
 * - Tailwind CSS with minification
 *
 * This works with both Bun and tsx/Node, unlike the plugin-based approach.
 */

import {
  buildClientScripts,
  discoverClientScripts,
  loadClientScriptPatterns,
  loadExternalDependencies,
} from "@~/config.bun-plugin-client-scripts";
import { $ } from "bun";
import { join } from "path";

//
// Configuration
//

const PROJECT_ROOT = join(import.meta.dir, "..");
const OUTDIR = join(PROJECT_ROOT, "bin/public/built");

//
// Main
//

console.log("🏗️  Building for production...\n");

// Build client scripts
const patterns = await loadClientScriptPatterns();
const external = await loadExternalDependencies();

if (patterns.length > 0) {
  console.log("Building client scripts...");
  const entrypoints = await discoverClientScripts(patterns);

  await buildClientScripts(entrypoints, OUTDIR, {
    minify: true,
    sourcemap: "external",
    external,
  });

  console.log("");
} else {
  console.log("No client script patterns configured");
  console.log("");
}

// Build Tailwind CSS
console.log("Building Tailwind CSS...");

await $`./bin/node_modules/.bin/tailwindcss -i sources/web/src/ui/tailwind.css -o bin/public/built/tailwind.css --config bin/tailwind.config.js --minify`.cwd(
  PROJECT_ROOT,
);

console.log("✓ Tailwind CSS built");
console.log("");

console.log("✅ Production build complete!");
