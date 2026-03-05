//

import type { AppEnvContext } from "#src/config";
import { useRequestContext } from "hono/jsx-renderer";

//

interface ClientScriptProps {
  src: string;
  async?: boolean;
  defer?: boolean;
  type?: "module" | "text/javascript";
}

// /src/lib/foo.client.ts -> /assets/VERSION/lib/foo.client.js
export function ClientScript({
  async,
  defer,
  src,
  type = "module",
}: ClientScriptProps) {
  const { env } = useRequestContext<AppEnvContext>();
  const builtSrc = src
    .replace(/\.ts$/, ".js")
    .replace(/^\/src\//, `${env.PUBLIC_ASSETS_PATH}/`);

  return <script async={async} defer={defer} src={builtSrc} type={type} />;
}
