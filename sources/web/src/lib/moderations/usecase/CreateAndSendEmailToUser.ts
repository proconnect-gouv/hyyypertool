//

import { NotFoundError } from "@~/core/error";
import { z_username } from "@~/core/schema";
import type { IdentiteProconnectDatabaseCradle } from "@~/identite-proconnect.database";
import type { UpdateModerationByIdHandler } from "#src/queries/moderations";
import type {
  RejectedFullMessage,
  RejectedModeration_Context,
} from "../context/rejected";
import type { RespondToTicketHandler } from "./RespondToTicket";

//

export function CreateAndSendEmailToUser({
  pg,
  respond_to_ticket,
  update_moderation_by_id,
}: IdentiteProconnectDatabaseCradle & {
  respond_to_ticket: RespondToTicketHandler;
  update_moderation_by_id: UpdateModerationByIdHandler;
}) {
  return async function create_and_send_email_to_user(
    context: RejectedModeration_Context,
    { message, reason, subject, to }: RejectedFullMessage,
  ) {
    const { crisp, moderation } = context;
    const user = await pg.query.users.findFirst({
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

    await update_moderation_by_id(moderation.id, {
      ticket_id: session_id,
    });

    await respond_to_ticket(
      {
        ...context,
        moderation: { ...context.moderation, ticket_id: session_id },
      },
      { message, reason, subject, to: session_id },
    );
  };
}

export type CreateAndSendEmailToUserHandler = ReturnType<
  typeof CreateAndSendEmailToUser
>;
