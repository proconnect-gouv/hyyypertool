//

import type { App_Context } from "#src/middleware/context";
import { Hono } from "hono";
import design_system_router from "./design-system";
import reload_router from "./reload";

//

export { notifyReload } from "./reload";

export default new Hono<App_Context>()
  .route("/", reload_router)
  .route("/", design_system_router);
