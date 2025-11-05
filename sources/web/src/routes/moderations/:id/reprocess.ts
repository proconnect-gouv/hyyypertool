//

import type { Htmx_Header } from "#src/htmx";
import type { App_Context } from "#src/middleware/context";
import { zValidator } from "@hono/zod-validator";
import { Entity_Schema } from "@~/core/schema";
import { MODERATION_EVENTS } from "@~/moderations/events/moderation_events";
import { Hono } from "hono";
import { reprocess_moderation } from "./reprocess_moderation.command";

//

export default new Hono<App_Context>().patch(
  "/",
  zValidator("param", Entity_Schema),
  async ({ text, req, var: { identite_pg, userinfo } }) => {
    const { id } = req.valid("param");

    await reprocess_moderation(identite_pg, id, userinfo);

    return text("OK", 200, {
      "HX-Trigger": MODERATION_EVENTS.enum.MODERATION_UPDATED,
    } as Htmx_Header);
  },
);
