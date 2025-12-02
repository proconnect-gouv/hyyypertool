/**
 * Development orchestration script
 *
 * Handles all build and watch processes for development:
 * - Builds and watches client scripts (*.client.ts files)
 * - Builds and watches Tailwind CSS
 * - Starts the dev server with hot reload
 *
 * This approach works with both Bun and tsx/Node, unlike the plugin-based approach.
 *
 * Client script example (ClipboardScript.tsx):
 * ```tsx
 * import { ClientScript } from "#src/html";
 * import clipboardUrl from "./clipboard.client.ts?url";
 *
 * export function ClipboardScript() {
 *   return <ClientScript src={clipboardUrl} />;
 * }
 * ```
 *
 * The ?url import is handled by transforming it to:
 *   clipboardUrl = "/src/lib/alpine/clipboard.client.js"
 */

import {
  buildClientScripts,
  discoverClientScripts,
  loadClientScriptPatterns,
  loadExternalDependencies,
} from "@~/config.bun-plugin-client-scripts";
import { $ } from "bun";
import { watch } from "fs";
import { join } from "path";

// Import live reload trigger
let reloadClients: (() => void) | undefined;
try {
  const liveReload = await import("bun-html-live-reload");
  reloadClients = liveReload.reloadClients;
} catch {
  // Live reload not available
}

//
// Configuration
//

const PROJECT_ROOT = join(import.meta.dir, "..");
const OUTDIR = join(PROJECT_ROOT, "bin/public/built");

//
// Build Functions
//

async function buildAllClientScripts() {
  const patterns = loadClientScriptPatterns();
  const external = loadExternalDependencies();

  if (patterns.length === 0) {
    console.log("No client script patterns configured in bunfig.toml");
    return;
  }

  console.log("Building client scripts...");
  const entrypoints = await discoverClientScripts(patterns);

  await buildClientScripts(entrypoints, OUTDIR, {
    minify: false,
    sourcemap: "inline", // Use inline sourcemaps in dev so browser can access source
    external,
  });

  console.log("");

  // Trigger browser reload
  reloadClients?.();
}

async function buildTailwind() {
  console.log("Building Tailwind CSS...");

  await $`./bin/node_modules/.bin/tailwindcss -i sources/web/src/ui/tailwind.css -o bin/public/built/tailwind.css --config bin/tailwind.config.js`.cwd(
    PROJECT_ROOT,
  );

  console.log("✓ Tailwind CSS built");
  console.log("");
}

//
// Watch Functions using fs.watch
//

function watchClientScripts() {
  console.log("👀 Watching client scripts for changes...");

  const sourcesWebSrc = join(PROJECT_ROOT, "sources/web/src");
  let rebuildTimer: Timer | null = null;

  const watcher = watch(
    sourcesWebSrc,
    { recursive: true },
    (event, filename) => {
      if (!filename) return;

      // Only watch .client.ts files, skip test files
      if (
        !filename.endsWith(".client.ts") ||
        filename.includes(".test.") ||
        filename.includes(".spec.")
      ) {
        return;
      }

      console.log(
        `\n[${new Date().toLocaleTimeString()}] Detected ${event}: ${filename}`,
      );

      // Debounce rebuilds (wait 100ms after last change)
      if (rebuildTimer) clearTimeout(rebuildTimer);
      rebuildTimer = setTimeout(async () => {
        await buildAllClientScripts();
        rebuildTimer = null;
      }, 100);
    },
  );

  // Cleanup watcher on exit
  process.once("SIGINT", () => {
    console.log("Closing client scripts watcher...");
    watcher.close();
  });

  console.log(`  Watching ${sourcesWebSrc}/**/*.client.ts`);
}

function watchTailwind() {
  console.log("👀 Watching Tailwind CSS...");

  // Start Tailwind in watch mode (async, runs in background)
  $`./bin/node_modules/.bin/tailwindcss -i sources/web/src/ui/tailwind.css -o bin/public/built/tailwind.css --config bin/tailwind.config.js --watch`
    .cwd(PROJECT_ROOT)
    .quiet();
}

//
// Main
//

console.log("🚀 Starting development environment...\n");

// Initial builds
await buildAllClientScripts();
await buildTailwind();

// Start watchers (non-blocking)
watchClientScripts();
watchTailwind();

// Start dev server with hot reload
console.log("🌐 Starting dev server...\n");
await $`bun run --hot src/bun/index.ts`;
