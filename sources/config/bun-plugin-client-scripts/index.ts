//

import { Glob, plugin, TOML, type BunPlugin } from "bun";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";

//

interface BunfigBuildConfig {
  build?: {
    clientScripts?: string[];
    external?: string[];
  };
}

//

function findProjectRoot(): string {
  let dir = process.cwd();

  while (dir !== "/") {
    const bunfigPath = join(dir, "bunfig.toml");
    if (existsSync(bunfigPath)) {
      try {
        const content = readFileSync(bunfigPath, "utf-8");
        const config = TOML.parse(content) as BunfigBuildConfig;
        // Only return if this bunfig has a [build] section
        if (config.build?.clientScripts) {
          return dir;
        }
      } catch {
        // Continue searching
      }
    }
    dir = dirname(dir);
  }

  return process.cwd();
}

const PROJECT_ROOT = findProjectRoot();

function loadBuildConfig(): BunfigBuildConfig["build"] {
  try {
    const bunfigPath = join(PROJECT_ROOT, "bunfig.toml");
    const bunfigContent = readFileSync(bunfigPath, "utf-8");
    const config = TOML.parse(bunfigContent) as BunfigBuildConfig;
    return config.build ?? {};
  } catch (error) {
    console.error("Warning: Could not load bunfig.toml:", error);
    return {};
  }
}

export function loadClientScriptPatterns(): string[] {
  return loadBuildConfig()?.clientScripts ?? [];
}

export function loadExternalDependencies(): string[] {
  return loadBuildConfig()?.external ?? [];
}

export async function discoverClientScripts(
  patterns: string[],
): Promise<string[]> {
  const files: string[] = [];

  for (const pattern of patterns) {
    const glob = new Glob(pattern);
    for await (const file of glob.scan({ cwd: PROJECT_ROOT })) {
      if (file.includes(".test.") || file.includes(".spec.")) continue;
      files.push(join(PROJECT_ROOT, file));
    }
  }

  return Array.from(new Set(files)).sort();
}

export async function buildClientScripts(
  entrypoints: string[],
  outdir: string,
  options: {
    minify?: boolean;
    sourcemap?: "external" | "inline" | "none";
    external?: string[];
    plugins?: BunPlugin[];
  } = {},
): Promise<void> {
  if (entrypoints.length === 0) {
    console.log("No client scripts to build");
    return;
  }

  console.log(`Building ${entrypoints.length} client script(s)...`);

  const { logs, outputs, success } = await Bun.build({
    entrypoints,
    minify: options.minify ?? true,
    outdir,
    root: join(PROJECT_ROOT, "sources/web/src"),
    sourcemap: options.sourcemap ?? "external",
    external: options.external ?? [], // Specific externals (preact, @preact/signals)
    plugins: options.plugins ?? [],
    naming: {
      entry: "[dir]/[name].[ext]",
    },
    splitting: true,
    format: "esm", // Ensure ESM output
  } as any);

  if (!success) {
    console.error("Client script build failed:", logs);
    throw new Error("Client script build failed");
  }

  // WORKAROUND: Bun doesn't add sourceMappingURL comments for external sourcemaps
  // Note: "inline" sourcemaps work automatically but increase file size
  // We prefer external sourcemaps (smaller downloads) and add the link manually
  if (options.sourcemap === "external") {
    const { appendFileSync } = await import("node:fs");
    for (const output of outputs) {
      if (output.path.endsWith(".js")) {
        const sourcemapFilename = `${output.path.split("/").pop()}.map`;
        appendFileSync(
          output.path,
          `\n//# sourceMappingURL=${sourcemapFilename}\n`,
        );
      }
    }
  }

  for (const output of outputs) {
    const relativePath = relative(PROJECT_ROOT, output.path);
    console.log(`  ✓ ${relativePath}`);
  }

  console.log(`✓ Built ${outputs.length} client script(s)`);
}

const clientScriptsPlugin: BunPlugin = {
  name: "client-scripts",

  async setup() {
    const patterns = loadClientScriptPatterns();

    if (patterns.length === 0) {
      console.log(
        "[bun-plugin-client-scripts] No client script patterns configured",
      );
      return;
    }

    const outdir = join(PROJECT_ROOT, "bin/public/built");
    const isDev = process.env.NODE_ENV === "development";
    const external = loadExternalDependencies();

    // Build client scripts
    try {
      const entrypoints = await discoverClientScripts(patterns);

      const watcherPlugin: BunPlugin = {
        name: "client-scripts-watcher",
        setup(build) {
          build.onLoad({ filter: /\.client\.ts$/ }, async (args) => {
            const contents = readFileSync(args.path, "utf-8");
            return { contents, loader: "tsx" };
          });
        },
      };

      await buildClientScripts(entrypoints, outdir, {
        minify: !isDev,
        sourcemap: isDev ? "inline" : "external", // Inline in dev for browser compatibility
        external,
        plugins: [watcherPlugin],
      });
    } catch (error) {
      console.error("[bun-plugin-client-scripts] Build failed:", error);
    }
  },
};

plugin(clientScriptsPlugin);
