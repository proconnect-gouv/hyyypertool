//

import { NotFoundError } from "#src/errors";
import type { CrispApi } from "#src/lib/crisp";
import { is_crisp_ticket } from "#src/lib/crisp";
import { send_crisp_notification } from "#src/lib/moderations";
import {
  get_full_ticket,
  GROUP_MONCOMPTEPRO,
  GROUP_MONCOMPTEPRO_SENDER_ID,
  ARTICLE_TYPE,
  is_zammad_ticket,
  send_zammad_response,
} from "#src/lib/zammad";
import { z_username } from "@~/core/schema";
import type { IdentiteProconnectDatabaseCradle } from "@~/identite-proconnect/database";
import type { GetModerationWithUserDto } from "#src/queries/moderations";
import { UpdateModerationById } from "#src/queries/moderations";
import { build_moderation_update } from "@~/moderations/build_moderation_update";

//

export async function mark_as_rejected(
  deps: IdentiteProconnectDatabaseCradle & {
    crisp: CrispApi;
    resolve_delay: number;
  },
  moderation: GetModerationWithUserDto,
  userinfo: { email: string; given_name: string; usual_name: string },
  { message: text_body, reason, subject }: { message: string; reason: string; subject: string },
) {
  const { pg, crisp, resolve_delay } = deps;

  const update_moderation_by_id = UpdateModerationById({ pg });
  const username = z_username.parse(userinfo);
  const body = text_body.concat(`  \n\n${username}`);
  const to = moderation.user.email;

  if (!moderation.ticket_id) {
    const { session_id } = await send_crisp_notification(crisp, {
      email: to,
      subject,
      nickname: to,
      content: body,
      sender: { nickname: username, email: userinfo.email },
    });

    await update_moderation_by_id(moderation.id, {
      ticket_id: session_id,
    });

    await crisp.mark_conversation_as_resolved({ session_id });
    await new Promise((resolve) => setTimeout(resolve, resolve_delay));
  } else if (is_crisp_ticket(moderation.ticket_id)) {
    await send_crisp_notification(crisp, {
      ticket_id: String(moderation.ticket_id),
      email: to,
      subject,
      nickname: to,
      content: body,
      sender: { nickname: username, email: userinfo.email },
    });

    await crisp.mark_conversation_as_resolved({ session_id: String(moderation.ticket_id) });
    await new Promise((resolve) => setTimeout(resolve, resolve_delay));
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
        to,
        type_id: ARTICLE_TYPE.enum.EMAIL,
      },
      group: GROUP_MONCOMPTEPRO,
      owner_id: user?.id,
      state: "closed",
    });
  } else {
    throw new NotFoundError(`Unknown provider for moderation "${moderation.id}"`);
  }

  const update = build_moderation_update({
    comment: moderation.comment,
    userinfo,
    reason,
    type: "REJECTED",
  });

  await update_moderation_by_id(moderation.id, update);
}
