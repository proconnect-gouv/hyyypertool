//

import type { AppContext } from "#src/middleware/context";
import { Hono } from "hono";
import auth_agentconnect_gouv_fr_router from "./auth.agentconnect.gouv.fr";
import livereload_router from "./reload";

//

export default new Hono<AppContext>()
  .use("*", async (c, next) => {
    if (c.env.NODE_ENV !== "development") return c.notFound();
    return next();
  })
  .route("/", livereload_router)
  .route("/auth.agentconnect.gouv.fr/api/v2", auth_agentconnect_gouv_fr_router);
