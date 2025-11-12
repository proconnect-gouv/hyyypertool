//

import type { RejectedModeration_Context } from "#src/lib/moderations";
import { mark_moderation_as } from "#src/lib/moderations";
import { RespondToTicket } from "#src/lib/moderations";
import { SendRejectedMessageToUser } from "#src/lib/moderations";
import { UpdateModerationById } from "#src/queries/moderations";

//

/**
 * Thin wrapper for rejecting a moderation.
 * Sends rejection message and marks moderation as rejected.
 */
export async function mark_as_rejected(
  context: RejectedModeration_Context,
  {
    message,
    reason,
    subject,
  }: {
    message: string;
    reason: string;
    subject: string;
  },
) {
  const update_moderation_by_id = UpdateModerationById({
    pg: context.pg,
  });
  const respond_to_ticket = RespondToTicket();
  const send_rejected_message_to_user = SendRejectedMessageToUser({
    respond_to_ticket,
    update_moderation_by_id,
  });

  await send_rejected_message_to_user(context, { message, reason, subject });
  await mark_moderation_as(context, "REJECTED");
}
