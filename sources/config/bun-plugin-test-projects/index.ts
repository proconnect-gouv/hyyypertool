//
// Bun test projects plugin - conditionally preloads setup based on file patterns
//

import { plugin, TOML, type BunPlugin } from "bun";
import { readFileSync } from "node:fs";
import { join } from "node:path";

interface PatternConfig {
  preload?: string | string[];
}

interface BunfigTestConfig {
  test?: {
    [key: string]: PatternConfig | unknown;
  };
}

// Load pattern configurations from bunfig.toml
function loadPatternConfigs(): Map<RegExp, string[]> {
  const patterns = new Map<RegExp, string[]>();

  try {
    const bunfigPath = join(process.cwd(), "bunfig.toml");
    const bunfigContent = readFileSync(bunfigPath, "utf-8");
    const config = TOML.parse(bunfigContent) as BunfigTestConfig;

    if (!config.test) {
      return patterns;
    }

    // Look for pattern-based configurations in [test."pattern"]
    for (const [key, value] of Object.entries(config.test)) {
      // Skip non-pattern keys like "preload", "projects", etc.
      if (key === "preload" || key === "projects" || !key.includes("*")) {
        continue;
      }

      const patternConfig = value as PatternConfig;
      if (patternConfig.preload) {
        // Convert glob pattern to regex
        // e.g., "*.test.dom.tsx" -> /.*\.test\.dom\.tsx$/
        const regexPattern = key.replace(/\./g, "\\.").replace(/\*/g, ".*");
        const regex = new RegExp(regexPattern + "$");

        const preloads = Array.isArray(patternConfig.preload)
          ? patternConfig.preload
          : [patternConfig.preload];

        patterns.set(regex, preloads);
      }
    }
  } catch (error) {
    console.error(
      "Warning: Could not load bunfig.toml pattern configs:",
      error,
    );
  }

  return patterns;
}

const patternConfigs = loadPatternConfigs();

const testProjectsPlugin: BunPlugin = {
  name: "test-projects",
  setup(build) {
    // For each pattern configuration, set up an onLoad handler
    for (const [pattern, preloads] of patternConfigs.entries()) {
      build.onLoad({ filter: pattern }, async (args) => {
        // Read the original file
        const originalContents = readFileSync(args.path, "utf-8");

        // Prepend preload imports
        const imports = preloads.map((p) => `import "${p}";`).join("\n");
        const contents = `${imports}\n\n${originalContents}`;

        // Determine loader based on file extension
        let loader: "ts" | "tsx" | "js" | "jsx" = "ts";
        if (args.path.endsWith(".tsx")) loader = "tsx";
        else if (args.path.endsWith(".jsx")) loader = "jsx";
        else if (args.path.endsWith(".js")) loader = "js";

        return {
          contents,
          loader,
        };
      });
    }
  },
};

plugin(testProjectsPlugin);
