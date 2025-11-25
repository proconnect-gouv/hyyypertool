//

import type { HtmxHeader } from "#src/htmx";
import { CrispApi } from "#src/lib/crisp";
import {
  MODERATION_EVENTS,
  reject_form_schema,
  type RejectedModeration_Context,
} from "#src/lib/moderations";
import { set_crisp_config } from "#src/middleware/crisp";
import { GetModerationWithUser } from "#src/queries/moderations";
import { zValidator } from "@hono/zod-validator";
import { EntitySchema } from "@~/core/schema";
import { Hono } from "hono";
import type { ContextType } from "../procedures_context";
import { mark_as_rejected } from "./mark_as_rejected.workflow";

//

export default new Hono<ContextType>().patch(
  "/",
  set_crisp_config(),
  zValidator("param", EntitySchema),
  zValidator("form", reject_form_schema),
  async function PATCH({
    text,
    req,
    var: { identite_pg, userinfo, crisp_config, config },
  }) {
    const { id: moderation_id } = req.valid("param");
    const { message, reason, subject } = req.valid("form");

    const get_moderation_with_user = GetModerationWithUser(identite_pg);
    const moderation = await get_moderation_with_user(moderation_id);
    const crisp = CrispApi(crisp_config);
    const context: RejectedModeration_Context = {
      crisp,
      moderation,
      pg: identite_pg,
      resolve_delay: config.CRISP_RESOLVE_DELAY,
      reason,
      subject,
      userinfo,
    };

    await mark_as_rejected(context, { message, reason, subject });

    return text("OK", 200, {
      "HX-Trigger": MODERATION_EVENTS.enum.MODERATION_UPDATED,
    } as HtmxHeader);
  },
);
