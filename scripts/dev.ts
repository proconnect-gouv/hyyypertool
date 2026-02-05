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

//

const c = {
  reset: "\x1b[0m",
  yellow: (t: string) => `\x1b[33m${t}\x1b[0m`,
  cyan: (t: string) => `\x1b[36m${t}\x1b[0m`,
  green: (t: string) => `\x1b[32m${t}\x1b[0m`,
  blue: (t: string) => `\x1b[34m${t}\x1b[0m`,
  magenta: (t: string) => `\x1b[35m${t}\x1b[0m`,
  dim: (t: string) => `\x1b[2m${t}\x1b[0m`,
};

// Track last prefix to reduce noise on consecutive output
let lastPrefix = "";

function log(prefix: string, line: string) {
  if (prefix !== lastPrefix) {
    console.log(prefix);
    lastPrefix = prefix;
  }
  console.log(line);
}

function runCommand(prefix: string, command: string[], cwd?: string) {
  const proc = Bun.spawn(command, {
    cwd: cwd ?? PROJECT_ROOT,
    stdout: "pipe",
    stderr: "pipe",
  });

  pipeOutput(proc.stdout, prefix);
  pipeOutput(proc.stderr, prefix);

  return proc;
}

async function pipeOutput(stream: ReadableStream<Uint8Array>, prefix: string) {
  const decoder = new TextDecoder();
  for await (const chunk of stream) {
    for (const line of decoder.decode(chunk).trimEnd().split("\n")) {
      log(prefix, line);
    }
  }
}

//

// Dynamic import to trigger live reload
let notifyReload: (() => void) | undefined;
async function loadReloadNotifier() {
  try {
    const module = await import("../sources/web/src/routes/__dev__/reload.tsx");
    notifyReload = module.notifyReload;
    console.log(`[${c.green("reload")}] Notifier loaded`);
  } catch (error) {
    console.warn(`[${c.green("reload")}] Could not load notifier:`, error);
  }
}

async function buildAllClientScripts() {
  const patterns = await loadClientScriptPatterns();
  const external = await loadExternalDependencies();

  if (patterns.length === 0) {
    console.log(`[${c.cyan("client")}] No patterns configured`);
    return;
  }

  console.log(`[${c.cyan("client")}] Building...`);
  const entrypoints = await discoverClientScripts(patterns);

  await buildClientScripts(entrypoints, OUTDIR, {
    external,
    minify: false,
    sourcemap: "inline",
  });

  console.log(`[${c.cyan("client")}] Done`);
  notifyReload?.();
}

function watchClientScripts() {
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

      console.log(`[${c.cyan("client")}] ${event}: ${filename}`);

      if (rebuildTimer) clearTimeout(rebuildTimer);
      rebuildTimer = setTimeout(async () => {
        await buildAllClientScripts();
        rebuildTimer = null;
      }, 100);
    },
  );

  process.once("SIGINT", () => watcher.close());

  console.log(`[${c.cyan("client")}] Watching **/*.client.ts`);
}

//

console.log(`[${c.blue("docker")}] Starting containers...`);
await $`docker compose up --build --detach --remove-orphans`.quiet();
console.log(`[${c.blue("docker")}] Ready`);

await buildAllClientScripts();
watchClientScripts();

const tailwind = runCommand(`[${c.magenta("tailwind")}]`, [
  "./bin/node_modules/.bin/tailwindcss",
  "-i",
  "sources/web/src/ui/tailwind.css",
  "-o",
  "bin/public/built/tailwind.css",
  "--watch=always",
]);

const server = runCommand(`[${c.yellow("server")}]`, [
  "tsx",
  "watch",
  "--clear-screen=false",
  "--tsconfig",
  "tsconfig.json",
  "bin/src/node/index.ts",
]);

setTimeout(loadReloadNotifier, 2000);

process.on("SIGINT", () => {
  console.log(c.dim("\nShutting down..."));
  tailwind.kill();
  server.kill();
  process.exit(0);
});

await server.exited;
