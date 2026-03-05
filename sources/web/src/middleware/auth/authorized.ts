//

import type { AppEnvContext } from "#src/config";
import { createMiddleware } from "hono/factory";
import { vip_list_guard } from "./vip_list.guard";

//

export function authorized() {
  return createMiddleware<AppEnvContext>(
    function authorized_middleware(c, next) {
      const {
        env: { ALLOWED_USERS },
      } = c;
      const middleware = vip_list_guard({
        vip_list: ALLOWED_USERS.split(","),
      });
      return middleware(c as any, next);
    },
  );
}
