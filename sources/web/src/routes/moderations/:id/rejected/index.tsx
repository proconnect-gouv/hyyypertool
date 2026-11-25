//

import type { HtmxHeader } from "#src/htmx";
import {
  build_moderation_update,
  MODERATION_EVENTS,
  reject_form_schema,
  reply_and_resolve_moderation_ticket,
} from "#src/lib/moderations";
import { render as render_template } from "#src/lib/response-templates";
import {
  get_moderation_with_details,
  get_moderation_with_user,
  update_moderation_by_id,
} from "#src/queries/moderations";
import { EntitySchema } from "#src/schema";
import { zValidator } from "@hono/zod-validator";
import { to } from "await-to-js";
import { Hono } from "hono";
import { z } from "zod";
import { build_template_data } from "../build_template_data";
import type { ContextType } from "../procedures_context";
import { get_response_template } from "./get_response_template.query";

//

const ReasonParamSchema = EntitySchema.extend({
  response_id: z.coerce.number().int().positive(),
});

//

export default new Hono<ContextType>()
  .get(
    "/reason/:response_id",
    zValidator("param", ReasonParamSchema),
    async function GET({ text, req, var: { identite_pg, hyyyper_pg } }) {
      const { id, response_id } = req.valid("param");

      const [moderation, template] = await Promise.all([
        get_moderation_with_details(identite_pg, id),
        get_response_template(hyyyper_pg, response_id),
      ]);

      const render_result = render_template(
        template?.content ?? "",
        await build_template_data(moderation, { pg: identite_pg }),
      );

      return text(render_result.result);
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
      const {
        message: text_body,
        subject,
        end_user_reason,
        allow_editing,
      } = req.valid("form");

      const moderation = await get_moderation_with_user(
        identite_pg,
        moderation_id,
      );

      const body = text_body;
      const recipient = moderation.user.email;

      const [, operator] = await to(crisp.get_user({ email: userinfo.email }));
      const sender = operator ?? { nickname: "L'équipe ProConnect" };

      await reply_and_resolve_moderation_ticket(
        {
          crisp,
          pg: identite_pg,
          resolve_delay: config.CRISP_RESOLVE_DELAY,
        },
        {
          moderation,
          email: recipient,
          subject,
          nickname: recipient,
          content: body,
          sender,
        },
      );

      const update = build_moderation_update({
        comment: moderation.comment,
        userinfo,
        end_user_reason,
        type: "REJECTED",
        allow_editing,
      });
      await update_moderation_by_id(identite_pg, {
        id: moderation.id,
        values: update,
      });

      return text("OK", 200, {
        "HX-Trigger": MODERATION_EVENTS.enum.MODERATION_UPDATED,
      } as HtmxHeader);
    },
  );
