//
// Bun plugin for auto-building client scripts
// Discovers *.client.ts files and builds them to bin/public/built/
//

import { Glob, TOML } from "bun";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";

//

interface BunfigBuildConfig {
  build?: {
    clientScripts?: string[];
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
 * Load client script patterns from bunfig.toml [build] section
 */
export function loadClientScriptPatterns(): string[] {
  try {
    const bunfigPath = join(PROJECT_ROOT, "bunfig.toml");
    const bunfigContent = readFileSync(bunfigPath, "utf-8");
    const config = TOML.parse(bunfigContent) as BunfigBuildConfig;

    return config.build?.clientScripts ?? [];
  } catch (error) {
    console.error("Warning: Could not load bunfig.toml:", error);
    return [];
  }
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
