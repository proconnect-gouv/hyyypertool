//

import {
  buildClientScripts,
  discoverClientScripts,
  loadClientScriptPatterns,
  loadExternalDependencies,
} from "@~/config.bun-plugin-client-scripts";
import { $ } from "bun";
import { watch } from "fs";
import { join } from "path";

//

let reloadClients: (() => void) | undefined;
try {
  const liveReload = await import("bun-html-live-reload");
  reloadClients = liveReload.reloadClients;
} catch {}

const PROJECT_ROOT = join(import.meta.dir, "..");
const OUTDIR = join(PROJECT_ROOT, "bin/public/built");

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
    external,
    minify: false,
    sourcemap: "inline",
  });

  console.log("");
  reloadClients?.();
}

async function buildTailwind() {
  console.log("Building Tailwind CSS...");

  await $`./bin/node_modules/.bin/tailwindcss -i sources/web/src/ui/tailwind.css -o bin/public/built/tailwind.css --config bin/tailwind.config.js`.cwd(
    PROJECT_ROOT,
  );

  console.log("✓ Tailwind CSS built\n");
}

function watchClientScripts() {
  console.log("👀 Watching client scripts for changes...");

  const sourcesWebSrc = join(PROJECT_ROOT, "sources/web/src");
  let rebuildTimer: Timer | null = null;

  const watcher = watch(
    sourcesWebSrc,
    { recursive: true },
    (event, filename) => {
      if (!filename) return;
      if (!filename.endsWith(".client.ts")) return;
      if (filename.includes(".test.") || filename.includes(".spec.")) return;

      console.log(
        `\n[${new Date().toLocaleTimeString()}] Detected ${event}: ${filename}`,
      );

      if (rebuildTimer) clearTimeout(rebuildTimer);
      rebuildTimer = setTimeout(async () => {
        await buildAllClientScripts();
        rebuildTimer = null;
      }, 100);
    },
  );

  process.once("SIGINT", () => watcher.close());

  console.log(`  Watching ${sourcesWebSrc}/**/*.client.ts`);
}

function watchTailwind() {
  console.log("👀 Watching Tailwind CSS...");
  $`./bin/node_modules/.bin/tailwindcss -i sources/web/src/ui/tailwind.css -o bin/public/built/tailwind.css --config bin/tailwind.config.js --watch`
    .cwd(PROJECT_ROOT)
    .quiet();
}

//

console.log("🚀 Starting development environment...\n");

await buildAllClientScripts();
await buildTailwind();

watchClientScripts();
watchTailwind();

console.log("🌐 Starting dev server...\n");
await $`bun run --hot src/bun/index.ts`;
