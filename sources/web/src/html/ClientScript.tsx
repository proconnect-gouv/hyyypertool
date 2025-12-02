//

import config from "#src/config";

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
  const builtSrc = src
    .replace(/\.ts$/, ".js")
    .replace(/^\/src\//, `${config.PUBLIC_ASSETS_PATH}/`);

  return <script async={async} defer={defer} src={builtSrc} type={type} />;
}
