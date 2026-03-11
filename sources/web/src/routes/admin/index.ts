//

import { is_htmx_request, type HtmxHeader } from "#src/htmx";
import { authorized } from "#src/middleware/auth";
import type { AdminAppContext } from "#src/middleware/context";
import { roles } from "@~/hyyyperbase";
import { Hono } from "hono";
import team_router from "../team";

//

export default new Hono<AdminAppContext>()
  .use(authorized())
  .use(async function admin_guard(c, next) {
    const hyyyper_user = c.var.hyyyper_user;
    if (hyyyper_user.role !== roles.enum.admin) {
      if (is_htmx_request(c.req.raw)) {
        return c.text("Forbidden", 403, {
          "HX-Location": "/",
        } as HtmxHeader);
      }
      return c.redirect("/");
    }
    return next();
  })
  .route("/team", team_router);
