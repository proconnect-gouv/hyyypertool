/**
 * Bun Plugin: Client Scripts Auto-Builder
 *
 * Automatically discovers and builds *.client.ts files during Bun initialization.
 * Uses the Bun plugin API but triggers builds during setup() rather than
 * intercepting imports (since client scripts are loaded via <script> tags,
 * not TypeScript imports).
 *
 * Features:
 * - Auto-discovery via glob patterns from bunfig.toml [build].clientScripts
 * - Builds to bin/public/built/ preserving directory structure
 * - Rebuilds automatically via Bun's --hot reload in dev server
 * - Self-registers via plugin() call
 *
 * Registration:
 * - Auto-loads via bunfig.toml [test].preload
 * - Also imported in bin/bunfig.toml preload for production builds
 *
 * Configuration:
 * - Reads patterns from bunfig.toml [build].clientScripts
 * - Outputs to bin/public/built/
 * - Minifies in production, skips minification in development
 *
 * Development:
 * - Use `bun run dev` which runs with --hot flag
 * - When .client.ts files change, Bun reloads and plugin rebuilds automatically
 *
 * @see bunfig.toml for configuration
 * @see sources/config/bun-plugin-test-projects for plugin pattern reference
 */

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

/**
 * Find the project root directory by looking for bunfig.toml with [build] section
 */
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

/**
 * Load build configuration from bunfig.toml [build] section
 */
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

/**
 * Load client script patterns from bunfig.toml [build] section
 */
export function loadClientScriptPatterns(): string[] {
  return loadBuildConfig()?.clientScripts ?? [];
}

/**
 * Load external dependencies from bunfig.toml [build] section
 */
export function loadExternalDependencies(): string[] {
  return loadBuildConfig()?.external ?? [];
}

/**
 * Discover all client script files matching the configured patterns
 */
export async function discoverClientScripts(
  patterns: string[],
): Promise<string[]> {
  const files: string[] = [];

  for (const pattern of patterns) {
    const glob = new Glob(pattern);
    for await (const file of glob.scan({ cwd: PROJECT_ROOT })) {
      // Exclude test files
      if (file.includes(".test.") || file.includes(".spec.")) {
        continue;
      }
      files.push(join(PROJECT_ROOT, file));
    }
  }

  // Sort for deterministic output
  return Array.from(new Set(files)).sort();
}

/**
 * Build all discovered client scripts
 */
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
    external: options.external ?? [],
    plugins: options.plugins ?? [],
    // Fix sourcemap paths to be relative to the source root
    // This makes browser dev tools resolve source files correctly
    naming: {
      entry: "[dir]/[name].[ext]",
    },
  });

  if (!success) {
    console.error("Client script build failed:", logs);
    throw new Error("Client script build failed");
  }

  for (const output of outputs) {
    const relativePath = relative(PROJECT_ROOT, output.path);
    console.log(`  ✓ ${relativePath}`);
  }

  console.log(`✓ Built ${outputs.length} client script(s)`);
}

/**
 * Main function to discover and build client scripts
 * @deprecated Use the plugin auto-build instead
 */
export async function buildAllClientScripts(
  outdir: string,
  options: { minify?: boolean } = {},
): Promise<void> {
  const patterns = loadClientScriptPatterns();

  if (patterns.length === 0) {
    console.log("No client script patterns configured in bunfig.toml");
    return;
  }

  const entrypoints = await discoverClientScripts(patterns);
  await buildClientScripts(entrypoints, outdir, options);
}

/**
 * Bun plugin for client scripts auto-building
 */
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

      // Create a plugin that watches the source files
      const watcherPlugin: BunPlugin = {
        name: "client-scripts-watcher",
        setup(build) {
          // Match all client script files
          build.onLoad({ filter: /\.client\.ts$/ }, async (args) => {
            // Use readFileSync to bypass any Bun.file caching
            const contents = readFileSync(args.path, "utf-8");
            return {
              contents,
              loader: "tsx",
            };
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
      // Don't throw - allow server to start
    }

    // Note: Watch mode is handled by Bun's native --hot flag in dev server
    // The server will reload and re-execute this plugin when files change
  },
};

// Register the plugin
plugin(clientScriptsPlugin);
