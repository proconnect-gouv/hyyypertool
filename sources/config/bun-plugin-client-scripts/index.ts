//

import { Glob, TOML, type BunPlugin } from "bun";
import { appendFile, exists, readFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";

//

interface BunfigBuildConfig {
  build?: {
    clientScripts?: string[];
    external?: string[];
  };
}

//

async function findProjectRoot(): Promise<string> {
  let dir = process.cwd();

  while (dir !== "/") {
    const bunfigPath = join(dir, "bunfig.toml");
    if (await exists(bunfigPath)) {
      try {
        const content = await readFile(bunfigPath, "utf-8");
        const config = TOML.parse(content) as BunfigBuildConfig;
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

let PROJECT_ROOT: string;

async function getProjectRoot(): Promise<string> {
  if (!PROJECT_ROOT) {
    PROJECT_ROOT = await findProjectRoot();
  }
  return PROJECT_ROOT;
}

async function loadBuildConfig(): Promise<BunfigBuildConfig["build"]> {
  try {
    const root = await getProjectRoot();
    const bunfigPath = join(root, "bunfig.toml");
    const bunfigContent = await readFile(bunfigPath, "utf-8");
    const config = TOML.parse(bunfigContent) as BunfigBuildConfig;
    return config.build ?? {};
  } catch (error) {
    console.error("Warning: Could not load bunfig.toml:", error);
    return {};
  }
}

export async function loadClientScriptPatterns(): Promise<string[]> {
  const config = await loadBuildConfig();
  return config?.clientScripts ?? [];
}

export async function loadExternalDependencies(): Promise<string[]> {
  const config = await loadBuildConfig();
  return config?.external ?? [];
}

export async function discoverClientScripts(
  patterns: string[],
): Promise<string[]> {
  const root = await getProjectRoot();
  const files: string[] = [];

  for (const pattern of patterns) {
    const glob = new Glob(pattern);
    for await (const file of glob.scan({ cwd: root })) {
      if (file.includes(".test.") || file.includes(".spec.")) continue;
      files.push(join(root, file));
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

  const root = await getProjectRoot();
  console.log(`Building ${entrypoints.length} client script(s)...`);

  const { logs, outputs, success } = await Bun.build({
    entrypoints,
    minify: options.minify ?? true,
    outdir,
    root: join(root, "sources/web/src"),
    sourcemap: options.sourcemap ?? "external",
    external: options.external ?? [],
    plugins: options.plugins ?? [],
    naming: {
      entry: "[dir]/[name].[ext]",
    },
    splitting: true,
    format: "esm",
  } as any);

  if (!success) {
    console.error("Client script build failed:", logs);
    throw new Error("Client script build failed");
  }

  // WORKAROUND: Bun doesn't add sourceMappingURL comments for external sourcemaps
  // Note: "inline" sourcemaps work automatically but increase file size
  // We prefer external sourcemaps (smaller downloads) and add the link manually
  if (options.sourcemap === "external") {
    for (const output of outputs) {
      if (output.path.endsWith(".js")) {
        const sourcemapFilename = `${output.path.split("/").pop()}.map`;
        await appendFile(
          output.path,
          `\n//# sourceMappingURL=${sourcemapFilename}\n`,
        );
      }
    }
  }

  for (const output of outputs) {
    const relativePath = relative(root, output.path);
    console.log(`  ✓ ${relativePath}`);
  }

  console.log(`✓ Built ${outputs.length} client script(s)`);
}
