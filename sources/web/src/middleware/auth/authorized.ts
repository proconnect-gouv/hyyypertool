//

import type { ConfigVariables_Context } from "#src/middleware/config";
import { createMiddleware } from "hono/factory";
import { vip_list_guard } from "./vip_list.guard";

//

export function authorized() {
  return createMiddleware<ConfigVariables_Context>(
    function authorized_middleware(c, next) {
      const {
        var: { config },
      } = c;
      const middleware = vip_list_guard({
        vip_list: config.ALLOWED_USERS.split(","),
      });
      return middleware(c as any, next);
    },
  );
}
