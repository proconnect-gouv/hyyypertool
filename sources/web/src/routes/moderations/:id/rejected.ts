//

import type { Htmx_Header } from "#src/htmx";
import { Entity_Schema } from "@~/core/schema";
import { zValidator } from "@hono/zod-validator";
import { CrispApi } from "@~/crisp.lib/api";
import { set_crisp_config } from "@~/crisp.middleware";
import { type RejectedModeration_Context } from "@~/moderations.lib/context/rejected";
import { MODERATION_EVENTS } from "@~/moderations.lib/event";
import { reject_form_schema } from "@~/moderations.lib/schema/rejected.form";
import { mark_moderation_as } from "@~/moderations.lib/usecase/mark_moderation_as";
import { RespondToTicket } from "@~/moderations.lib/usecase/RespondToTicket";
import { SendRejectedMessageToUser } from "@~/moderations.lib/usecase/SendRejectedMessageToUser";
import {
  GetModerationWithUser,
  UpdateModerationById,
} from "@~/moderations.repository";
import { Hono } from "hono";
import type { ContextType } from "./procedures_context";

//

export default new Hono<ContextType>().patch(
  "/",
  set_crisp_config(),
  zValidator("param", Entity_Schema),
  zValidator("form", reject_form_schema),
  async function PATH({
    text,
    req,
    var: { identite_pg, userinfo, crisp_config, config },
  }) {
    const { id: moderation_id } = req.valid("param");
    const { message, reason, subject } = req.valid("form");

    const get_moderation_with_user = GetModerationWithUser(identite_pg);
    const moderation = await get_moderation_with_user(moderation_id);
    const crisp = CrispApi(crisp_config);
    const update_moderation_by_id = UpdateModerationById({ pg: identite_pg });
    const respond_to_ticket = RespondToTicket();
    const context: RejectedModeration_Context = {
      crisp,
      moderation,
      pg: identite_pg,
      resolve_delay: config.CRISP_RESOLVE_DELAY,
      reason,
      subject,
      userinfo,
    };
    const send_rejected_message_to_user = SendRejectedMessageToUser({
      respond_to_ticket,
      update_moderation_by_id,
    });
    await send_rejected_message_to_user(context, {
      message,
      reason,
      subject,
    });

    await mark_moderation_as(context, "REJECTED");

    return text("OK", 200, {
      "HX-Trigger": MODERATION_EVENTS.enum.MODERATION_UPDATED,
    } as Htmx_Header);
  },
);
