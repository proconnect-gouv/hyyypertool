//

import { admin_email_list } from "#src/config";
import type { ConfigVariablesContext } from "#src/middleware/config";
import { createMiddleware } from "hono/factory";
import { vip_list_guard } from "./vip_list.guard";

//

export function authorized() {
  return createMiddleware<ConfigVariablesContext>(
    function authorized_middleware(c, next) {
      const middleware = vip_list_guard({
        vip_list: admin_email_list,
      });
      return middleware(c as any, next);
    },
  );
}
