//

import type { Htmx_Header } from "#src/htmx";
import type { UserInfoVariablesContext } from "#src/middleware/auth";
import type { IdentiteProconnect_Pg_Context } from "#src/middleware/identite-pg";
import { zValidator } from "@hono/zod-validator";
import { Entity_Schema } from "@~/core/schema";
import { MODERATION_EVENTS } from "#src/lib/moderations";
import { mark_moderatio_as_rejected } from "#src/lib/moderations";
import { GetModerationWithUser } from "@~/moderations.repository";
import { Hono } from "hono";

//

export default new Hono<
  IdentiteProconnect_Pg_Context & UserInfoVariablesContext
>().patch(
  "/",
  zValidator("param", Entity_Schema),
  async ({ text, req, notFound, var: { identite_pg, userinfo } }) => {
    const { id } = req.valid("param");

    const get_moderation_with_user = GetModerationWithUser(identite_pg);
    const moderation = await get_moderation_with_user(id);

    if (!moderation) return notFound();

    await mark_moderatio_as_rejected({
      pg: identite_pg,
      moderation,
      userinfo,
      reason: "DUPLICATE",
    });

    return text("OK", 200, {
      "HX-Trigger": [
        MODERATION_EVENTS.enum.MODERATION_EMAIL_UPDATED,
        MODERATION_EVENTS.enum.MODERATION_UPDATED,
      ].join(", "),
    } as Htmx_Header);
  },
);
