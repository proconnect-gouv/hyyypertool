/**
 * ClientScript component for loading client-side scripts
 *
 * Automatically handles path transformation from source .ts files to built .js files.
 * Transforms web-relative paths to versioned asset paths.
 *
 * Usage:
 * ```tsx
 * <ClientScript src="/src/lib/my-script.client.ts" />
 * ```
 *
 * The component transforms the path to the built assets location:
 * /src/lib/foo.client.ts -> /assets/VERSION/public/built/lib/foo.client.js
 */

import config from "#src/config";

interface ClientScriptProps {
  /**
   * Web-relative path to the client script source file
   * Example: "/src/lib/alpine/clipboard.client.ts"
   */
  src: string;
  /**
   * Script type (default: "module")
   */
  type?: "module" | "text/javascript";
  /**
   * Async loading
   */
  async?: boolean;
  /**
   * Defer loading
   */
  defer?: boolean;
}

export function ClientScript({
  src,
  type = "module",
  async,
  defer,
}: ClientScriptProps) {
  // Transform /src/... path to built assets path
  // /src/lib/alpine/clipboard.ts -> /assets/VERSION/lib/alpine/clipboard.client.js
  const builtSrc = src.replace(/\.ts$/, ".js").replace(/^\/src\//, `${config.PUBLIC_ASSETS_PATH}/`);

  return (
    <script
      type={type}
      src={builtSrc}
      async={async}
      defer={defer}
    />
  );
}
