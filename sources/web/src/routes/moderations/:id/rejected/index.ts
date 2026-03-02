//

import { NotFoundError } from "#src/errors";
import type { HtmxHeader } from "#src/htmx";
import { is_crisp_ticket } from "#src/lib/crisp";
import {
  MODERATION_EVENTS,
  reject_form_schema,
  send_crisp_notification,
} from "#src/lib/moderations";
import {
  ARTICLE_TYPE,
  get_full_ticket,
  GROUP_MONCOMPTEPRO,
  GROUP_MONCOMPTEPRO_SENDER_ID,
  is_zammad_ticket,
  send_zammad_response,
} from "#src/lib/zammad";
import {
  GetModerationWithUser,
  UpdateModerationById,
} from "#src/queries/moderations";
import { zValidator } from "@hono/zod-validator";
import { EntitySchema, z_username } from "@~/core/schema";
import { build_moderation_update } from "@~/moderations/build_moderation_update";
import { to } from "await-to-js";
import { Hono } from "hono";
import type { ContextType } from "../procedures_context";

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
    const { message: text_body, reason, subject } = req.valid("form");

    const get_moderation_with_user = GetModerationWithUser(identite_pg);
    const update_moderation_by_id = UpdateModerationById({ pg: identite_pg });
    const moderation = await get_moderation_with_user(moderation_id);

    const username = z_username.parse(userinfo);
    const body = text_body.concat(`  \n\n${username}`);
    const recipient = moderation.user.email;

    const [, operator] = await to(crisp.get_user({ email: userinfo.email }));
    const sender = operator ?? { nickname: username };

    if (!moderation.ticket_id) {
      const { session_id } = await send_crisp_notification(crisp, {
        email: recipient,
        subject,
        nickname: recipient,
        content: body,
        sender,
      });

      await update_moderation_by_id(moderation.id, {
        ticket_id: session_id,
      });

      await new Promise((resolve) =>
        setTimeout(resolve, config.CRISP_RESOLVE_DELAY),
      );

      await crisp.mark_conversation_as_resolved({ session_id });
    } else if (is_crisp_ticket(moderation.ticket_id)) {
      await send_crisp_notification(crisp, {
        ticket_id: String(moderation.ticket_id),
        email: recipient,
        subject,
        nickname: recipient,
        content: body,
        sender,
      });

      await new Promise((resolve) =>
        setTimeout(resolve, config.CRISP_RESOLVE_DELAY),
      );

      await crisp.mark_conversation_as_resolved({
        session_id: String(moderation.ticket_id),
      });
    } else if (is_zammad_ticket(moderation.ticket_id)) {
      const ticket_id_num = Number(moderation.ticket_id);
      const result = await get_full_ticket({ ticket_id: ticket_id_num });

      const user = Object.values(result.assets.User || {}).find((user) => {
        return user.email === userinfo.email;
      });

      const zammad_body = body.replace(/\n/g, "<br />");

      await send_zammad_response(ticket_id_num, {
        article: {
          body: zammad_body,
          content_type: "text/html",
          sender_id: GROUP_MONCOMPTEPRO_SENDER_ID,
          subject,
          subtype: "reply",
          to: recipient,
          type_id: ARTICLE_TYPE.enum.EMAIL,
        },
        group: GROUP_MONCOMPTEPRO,
        owner_id: user?.id,
        state: "closed",
      });
    } else {
      throw new NotFoundError(
        `Unknown provider for moderation "${moderation.id}"`,
      );
    }

    const update = build_moderation_update({
      comment: moderation.comment,
      userinfo,
      reason,
      type: "REJECTED",
    });
    await update_moderation_by_id(moderation.id, update);

    return text("OK", 200, {
      "HX-Trigger": MODERATION_EVENTS.enum.MODERATION_UPDATED,
    } as HtmxHeader);
  },
);
