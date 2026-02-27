//

import type { HtmxHeader } from "#src/htmx";
import { MODERATION_EVENTS, reject_form_schema } from "#src/lib/moderations";
import { GetModerationWithUser } from "#src/queries/moderations";
import { zValidator } from "@hono/zod-validator";
import { EntitySchema } from "@~/core/schema";
import { Hono } from "hono";
import type { ContextType } from "../procedures_context";
import { mark_as_rejected } from "./mark_as_rejected";

//

export default new Hono<ContextType>().patch(
  "/",
  zValidator("param", EntitySchema),
  zValidator("form", reject_form_schema),
  async function PATCH({
    text,
    req,
    var: { identite_pg, userinfo, crisp, config },
  }) {
    const { id: moderation_id } = req.valid("param");
    const { message, reason, subject } = req.valid("form");

    const get_moderation_with_user = GetModerationWithUser(identite_pg);
    const moderation = await get_moderation_with_user(moderation_id);

    await mark_as_rejected(
      {
        pg: identite_pg,
        crisp,
        resolve_delay: config.CRISP_RESOLVE_DELAY,
      },
      moderation,
      userinfo,
      { message, reason, subject },
    );

    return text("OK", 200, {
      "HX-Trigger": MODERATION_EVENTS.enum.MODERATION_UPDATED,
    } as HtmxHeader);
  },
);
