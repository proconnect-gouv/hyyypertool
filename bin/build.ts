//
//

import { $ } from "bun";
import { existsSync } from "node:fs";
import { join } from "node:path";

const minify = true;
const outdir = "./public/built";

// Build Tailwind CSS
const tailwindOutputPath = join(outdir, "tailwind.css");
const isDevMode = process.env.NODE_ENV !== "production";
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

// Watch for changes in development mode using Tailwind's built-in watcher
if (isDevMode) {
  console.log("🚀 Starting Tailwind CSS built-in watcher...");

  try {
    const tailwindProcess = Bun.spawn({
      cmd: [
        "./bin/node_modules/.bin/tailwindcss",
        "-i",
        "sources/web/src/ui/tailwind.css",
        "-o",
        "bin/public/built/tailwind.css",
        "--config",
        "bin/tailwind.config.js",
        "--watch",
      ],
      cwd: "..",
      stdout: "inherit",
      stderr: "inherit",
    });

    console.log("📁 Tailwind CSS watcher started (using built-in --watch)");
    console.log("📁 Watching for changes in: sources/web/src/ui/tailwind.css");
    console.log("📁 Press Ctrl+C to stop");

    // Graceful shutdown
    process.on("SIGINT", () => {
      console.log("\n🛑 Stopping Tailwind CSS watcher...");
      tailwindProcess.kill();
      process.exit(0);
    });

    process.on("SIGTERM", () => {
      console.log("\n🛑 Stopping Tailwind CSS watcher...");
      tailwindProcess.kill();
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Failed to start Tailwind CSS watcher:", error);
    console.log("🔧 Falling back to manual build mode...");
  }
} else {
  // Build other assets when not in dev mode
  {
    const { logs, outputs, success } = await Bun.build({
      entrypoints: ["../sources/web/src/layouts/_client/nprogress.ts"],
      external: ["@~/core/config"],
      minify,
      outdir,
    });
    console.log({ logs, outputs, success });
  }
}

export {};
