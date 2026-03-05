//

import { app_env } from "#src/config";

//

const { ASSETS_PATH } = app_env.parse(process.env);

export function rewriteAssetRequestPath(path: string) {
  return path.replace(ASSETS_PATH, "");
}
