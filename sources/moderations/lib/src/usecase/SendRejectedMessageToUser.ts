import { NotFoundError } from "@~/core/error";
import { z_username } from "@~/core/schema";
import type { UpdateModerationByIdHandler } from "@~/moderations.repository";
import { to as await_to } from "await-to-js";
import consola from "consola";
import type { RejectedModeration_Context } from "../context/rejected";
import type { RejectedMessage } from "../schema/rejected.form";
import { CreateAndSendEmailToUser } from "./CreateAndSendEmailToUser";
import type { RespondToTicketHandler } from "./RespondToTicket";

//

export function SendRejectedMessageToUser({
  respond_to_ticket,
  update_moderation_by_id,
}: {
  respond_to_ticket: RespondToTicketHandler;
  update_moderation_by_id: UpdateModerationByIdHandler;
}) {
  return async function send_rejected_message_to_user(
    context: RejectedModeration_Context,
    { message: text_body, reason, subject }: RejectedMessage,
  ) {
    const { moderation, userinfo } = context;
    const username = z_username.parse(userinfo);
    const body = text_body.concat(`  \n\n${username}`);
    const to = moderation.user.email;

    const [error] = await await_to(
      respond_to_ticket(context, { message: body, reason, subject, to }),
    );
    if (error instanceof NotFoundError) {
      consola.info(error);
      const create_and_send_email_to_user = CreateAndSendEmailToUser({
        pg: context.pg,
        respond_to_ticket,
        update_moderation_by_id,
      });
      await create_and_send_email_to_user(context, {
        message: body,
        reason,
        subject,
        to,
      });
    }
  };
}
