//

import type { Htmx_Header } from "#src/htmx";
import type { UserInfoVariablesContext } from "#src/middleware/auth";
import type { IdentiteProconnect_Pg_Context } from "#src/middleware/identite-pg";
import { zValidator } from "@hono/zod-validator";
import { Entity_Schema } from "@~/core/schema";
import { MODERATION_EVENTS } from "@~/moderations/events/moderation_events";
import { Hono } from "hono";
import { mark_as_rejected } from "./mark_as_rejected.command";

//

export default new Hono<
  IdentiteProconnect_Pg_Context & UserInfoVariablesContext
>().patch(
  "/",
  zValidator("param", Entity_Schema),
  async ({ text, req, var: { identite_pg, userinfo } }) => {
    const { id } = req.valid("param");

    await mark_as_rejected(identite_pg, id, userinfo, "DUPLICATE");

    return text("OK", 200, {
      "HX-Trigger": [
        MODERATION_EVENTS.enum.MODERATION_EMAIL_UPDATED,
        MODERATION_EVENTS.enum.MODERATION_UPDATED,
      ].join(", "),
    } as Htmx_Header);
  },
);
