//

import { ASSETS_PATH } from "./config";

//

export function rewriteAssetRequestPath(path: string) {
  return path.replace(ASSETS_PATH, "");
}
