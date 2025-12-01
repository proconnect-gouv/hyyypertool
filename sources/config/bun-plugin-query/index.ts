/**
 * Bun plugin for Vite-style query parameter imports
 * Handles ?url, ?raw, and ?inline query parameters
 */

import { type BunPlugin, plugin } from "bun";

/**
 * Get MIME type from file extension
 */
function getMimeType(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase() || "";
  const mimeTypes: Record<string, string> = {
    svg: "image/svg+xml",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
    ico: "image/x-icon",
    json: "application/json",
    css: "text/css",
    js: "text/javascript",
  };
  return mimeTypes[ext] || "application/octet-stream";
}

/**
 * Transform absolute filesystem path to web-relative path
 * The path transformation maps: /sources/web/src/... → /src/...
 * This works because the build serves web assets from /src
 */
function transformPath(filePath: string): string {
  // Match the sources/web/src portion and extract the rest
  const match = filePath.match(/sources\/web\/src\/(.*)/);
  if (match) {
    return `/src/${match[1]}`;
  }

  // Fallback: if the path doesn't match the pattern, return as-is
  // (This might happen for paths outside the web source directory)
  return filePath;
}

/**
 * Query parameter plugin
 */
const queryParamsPlugin: BunPlugin = {
  name: "query-params",

  setup(build) {
    // Handle ?url imports - returns path as string
    build.onLoad({ filter: /\?url$/ }, async (args) => {
      const path = args.path.replace(/\?url$/, "");
      const webPath = transformPath(path);

      return {
        contents: `export default ${JSON.stringify(webPath)}`,
        loader: "js" as const,
      };
    });

    // Handle ?raw imports - returns file contents as string
    build.onLoad({ filter: /\?raw$/ }, async (args) => {
      const path = args.path.replace(/\?raw$/, "");
      const contents = await Bun.file(path).text();

      return {
        contents: `export default ${JSON.stringify(contents)}`,
        loader: "js" as const,
      };
    });

    // Handle ?inline imports - returns base64 data URI
    build.onLoad({ filter: /\?inline$/ }, async (args) => {
      const path = args.path.replace(/\?inline$/, "");
      const buffer = await Bun.file(path).arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      const mimeType = getMimeType(path);
      const dataUri = `data:${mimeType};base64,${base64}`;

      return {
        contents: `export default ${JSON.stringify(dataUri)}`,
        loader: "js" as const,
      };
    });
  },
};

// Register the plugin
plugin(queryParamsPlugin);
