//

import { is_htmx_request, type HtmxHeader } from "#src/htmx";
import { createMiddleware } from "hono/factory";
import { NotAuthorized } from "./NotAuthorized";
import type { UserInfoVariablesContext } from "./set_userinfo";

//

export function vip_list_guard({ vip_list }: { vip_list: string[] }) {
  return createMiddleware<UserInfoVariablesContext>(
    async function vip_list_guard_middleware(
      { redirect, render, req, text, var: { userinfo } },
      next,
    ) {
      if (!userinfo) {
        if (is_htmx_request(req.raw)) {
          return text("Unauthorized", 401, {
            "HX-Location": "/",
          } as HtmxHeader);
        }

        return redirect("/");
      }
      const is_allowed = vip_list.includes(userinfo.email);
      if (!is_allowed) {
        return render(<NotAuthorized />);
      }
      return next();
    },
  );
}
