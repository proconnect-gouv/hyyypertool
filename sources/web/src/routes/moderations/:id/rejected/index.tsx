//

import type { HtmxHeader } from "#src/htmx";
import { is_crisp_ticket } from "#src/lib/crisp";
import {
  build_moderation_update,
  MODERATION_EVENTS,
  reject_form_schema,
  render as render_template,
  send_crisp_notification,
} from "#src/lib/moderations";
import {
  GetModerationWithDetails,
  GetModerationWithUser,
  UpdateModerationById,
} from "#src/queries/moderations";
import { EntitySchema, z_username } from "#src/schema";
import { zValidator } from "@hono/zod-validator";
import { to } from "await-to-js";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { z } from "zod";
import { build_template_data } from "../build_template_data";
import type { ContextType } from "../procedures_context";
import { get_response_template_by_label } from "./get_response_template_by_label.query";

//

const MessageQuerySchema = z.object({
  reason: z.string().min(1),
});

//

export default new Hono<ContextType>()
  .get(
    "/message",
    jsxRenderer(),
    zValidator("param", EntitySchema),
    zValidator("query", MessageQuerySchema),
    async function GET({ render, req, var: { identite_pg, hyyyper_pg } }) {
      const { id } = req.valid("param");
      const { reason: label } = req.valid("query");

      const [moderation, template] = await Promise.all([
        GetModerationWithDetails(identite_pg)(id),
        get_response_template_by_label(hyyyper_pg, label),
      ]);

      const content = render_template(
        template?.content ?? "",
        await build_template_data(moderation, { pg: identite_pg }),
      ).result;

      return render(
        <textarea
          class="fr-input"
          rows={15}
          id={`rejection-message-${id}`}
          name={reject_form_schema.keyof().enum.message}
        >
          {content}
        </textarea>,
      );
    },
  )
  .patch(
    "/",
    zValidator("param", EntitySchema),
    zValidator("form", reject_form_schema),
    async function PATCH({
      text,
      req,
      env: config,
      var: { identite_pg, userinfo, crisp },
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

      if (!moderation.ticket_id || !is_crisp_ticket(moderation.ticket_id)) {
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
      } else {
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
