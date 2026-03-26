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

const PROJECT_ROOT = join(import.meta.dir, "..");
const OUTDIR = join(PROJECT_ROOT, "bin/public/built");
const TIMEOUT_DELAY = 111;

async function loadReloadNotifier() {
  try {
    console.log("[live-reload] Notifier loaded");
  } catch (error) {
    console.warn("[live-reload] Could not load notifier:", error);
  }
}

//

async function buildAllClientScripts() {
  const patterns = await loadClientScriptPatterns();
  const external = await loadExternalDependencies();

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
      if (
        !(filename.endsWith(".client.ts") || filename.endsWith(".client.tsx"))
      )
        return;
      if (filename.includes(".test.") || filename.includes(".spec.")) return;

      console.log(
        `\n[${new Date().toLocaleTimeString()}] Detected ${event}: ${filename}`,
      );

      if (rebuildTimer) clearTimeout(rebuildTimer);
      rebuildTimer = setTimeout(async () => {
        await buildAllClientScripts();
        rebuildTimer = null;
      }, TIMEOUT_DELAY);
    },
  );

  process.once("SIGINT", () => watcher.close());

  console.log(`  Watching ${sourcesWebSrc}/**/*.client.ts`);
}

//

console.log("🚀 Starting development environment...\n");

await buildAllClientScripts();

watchClientScripts();
console.log("👀 Watching Tailwind CSS...\n");
Bun.spawn(
  [
    "./bin/node_modules/.bin/tailwindcss",
    "-i",
    "sources/web/src/ui/tailwind.css",
    "-o",
    "bin/public/built/tailwind.css",
    "--watch=always",
  ],
  {
    cwd: PROJECT_ROOT,
    stdout: "inherit",
    stderr: "inherit",
  },
);

//

let reloading_timeout: Timer | null = null;
const watcher = watch(OUTDIR, { recursive: true }, (event, filename) => {
  if (!filename) return;
  console.log(
    `\n[${new Date().toLocaleTimeString()}] ♻️ Detected ${event}: ${filename}`,
  );
  if (reloading_timeout) clearTimeout(reloading_timeout);
  reloading_timeout = setTimeout(async () => {
    fetch("http://localhost:3000/___dev___/reload", { method: "POST" }).catch(
      () => {},
    );
    reloading_timeout = null;
  }, TIMEOUT_DELAY);
});

process.once("SIGINT", () => watcher.close());

//

console.log("🌐 Starting dev server...\n");

// Wait a bit for the server to start before loading the notifier
setTimeout(loadReloadNotifier, 2000);

await $.cwd(
  "..",
)`tsx watch --clear-screen=false --tsconfig tsconfig.json --import ./bin/src/node/instrument.ts bin/src/node/index.ts`;
