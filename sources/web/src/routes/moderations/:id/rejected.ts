//

import type { Htmx_Header } from "#src/htmx";
import { set_crisp_config } from "#src/middleware/crisp";
import { zValidator } from "@hono/zod-validator";
import { NotFoundError } from "@~/core/error";
import { Entity_Schema, z_username } from "@~/core/schema";
import { is_crisp_ticket } from "@~/crisp.lib";
import { CrispApi } from "@~/crisp.lib/api";
import { schema } from "@~/identite-proconnect.database";
import { MODERATION_EVENTS } from "@~/moderations/events/moderation_events";
import { reject_form_schema } from "./rejected_form_schema";
import { get_moderation_with_user } from "./get_moderation_with_user";
import { get_full_ticket, send_zammad_response } from "@~/zammad.lib";
import { eq } from "drizzle-orm";
import {
  ARTICLE_TYPE,
  GROUP_MONCOMPTEPRO,
  GROUP_MONCOMPTEPRO_SENDER_ID,
} from "@~/zammad.lib/const";
import { is_zammad_ticket } from "@~/zammad.lib/is_zammad_ticket";
import { to as await_to } from "await-to-js";
import consola from "consola";
import { Hono } from "hono";
import { match } from "ts-pattern";
import type { ContextType } from "./procedures_context";
import { reject_moderation } from "./reject_moderation.command";

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

    const moderation = await get_moderation_with_user(identite_pg, moderation_id);
    const crisp = CrispApi(crisp_config);

    const to = moderation.user.email;
    const username = z_username.parse(userinfo);
    const body = message.concat(`  \n\n${username}`);

    //
    // Send rejection message to user via ticket system
    //

    const [error] = await await_to(
      send_rejection_to_ticket({
        crisp,
        moderation,
        userinfo,
        resolve_delay: config.CRISP_RESOLVE_DELAY,
        body,
        subject,
        to,
      }),
    );

    // If no existing ticket, create new conversation
    if (error instanceof NotFoundError) {
      consola.info(error);

      const user = await identite_pg.query.users.findFirst({
        columns: { given_name: true, family_name: true },
        where: (table, { eq }) => eq(table.id, moderation.user_id),
      });
      if (!user) throw new NotFoundError(`User not found`);

      const nickname = z_username.parse({
        given_name: user.given_name,
        usual_name: user.family_name,
      });

      const { session_id } = await crisp.create_conversation({
        email: to,
        subject,
        nickname,
      });

      await identite_pg
        .update(schema.moderations)
        .set({ ticket_id: session_id })
        .where(eq(schema.moderations.id, moderation.id));

      await send_rejection_to_ticket({
        crisp,
        moderation: { ...moderation, ticket_id: session_id },
        userinfo,
        resolve_delay: config.CRISP_RESOLVE_DELAY,
        body,
        subject,
        to: session_id,
      });
    }

    //
    // Mark moderation as rejected
    //

    await reject_moderation(identite_pg, moderation_id, userinfo, reason);

    return text("OK", 200, {
      "HX-Trigger": MODERATION_EVENTS.enum.MODERATION_UPDATED,
    } as Htmx_Header);
  },
);

//
// Helper: Type guard for crisp tickets
//

function is_crisp_ticket_guard(
  ticket_id: string | number,
): ticket_id is string {
  return is_crisp_ticket(ticket_id);
}

function is_zammad_ticket_guard(
  ticket_id: string | number,
): ticket_id is string {
  return is_zammad_ticket(ticket_id);
}

//
// Helper: Send rejection message to existing ticket
//

async function send_rejection_to_ticket({
  crisp,
  moderation,
  userinfo,
  resolve_delay,
  body,
  subject,
  to,
}: {
  crisp: ReturnType<typeof CrispApi>;
  moderation: { id: number; ticket_id: string | null };
  userinfo: { email: string; given_name: string; usual_name: string };
  resolve_delay: number;
  body: string;
  subject: string;
  to: string;
}) {
  if (!moderation.ticket_id) {
    throw new NotFoundError("No existing ticket.");
  }

  await match(moderation.ticket_id)
    .when(is_crisp_ticket_guard, async (ticket_id) => {
      const [, found_user] = await await_to(
        crisp.get_user({ email: userinfo.email }),
      );
      const user = found_user ?? {
        nickname: z_username.parse(userinfo),
        email: userinfo.email,
      };

      await crisp.send_message({
        content: body,
        user,
        session_id: ticket_id,
      });

      // HACK(douglasduteil): Wait for the message to be sent
      // Crisp seems to have a delay between the message being sent and the state being updated
      await new Promise((resolve) => setTimeout(resolve, resolve_delay));

      await crisp.mark_conversation_as_resolved({
        session_id: ticket_id,
      });
    })
    .when(is_zammad_ticket_guard, async (ticket_id_str) => {
      const ticket_id = Number(ticket_id_str);

      const result = await get_full_ticket({ ticket_id });

      const user = Object.values(result.assets.User || {}).find((user) => {
        return user.email === userinfo.email;
      });

      const html_body = body.replace(/\n/g, "<br />");

      await send_zammad_response(ticket_id, {
        article: {
          body: html_body,
          content_type: "text/html",
          sender_id: GROUP_MONCOMPTEPRO_SENDER_ID,
          subject,
          subtype: "reply",
          to,
          type_id: ARTICLE_TYPE.enum.EMAIL,
        },
        group: GROUP_MONCOMPTEPRO,
        owner_id: user?.id,
        state: "closed",
      });
    })
    .otherwise(() => {
      throw new NotFoundError(`Unknown provider for "${moderation.id}"`);
    });
}
