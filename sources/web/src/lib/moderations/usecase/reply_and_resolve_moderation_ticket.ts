//

import { parse_ticket_id, type CrispApi } from "#src/lib/crisp";
import { update_moderation_by_id } from "#src/queries/moderations";
import type { IdentiteProconnectPgDatabase } from "@~/identite-proconnect/database";
import { send_crisp_notification } from "./send_crisp_notification";

//

export async function reply_and_resolve_moderation_ticket(
  {
    crisp,
    pg,
    resolve_delay,
  }: {
    crisp: Pick<
      CrispApi,
      "create_conversation" | "mark_conversation_as_resolved" | "send_message"
    >;
    pg: IdentiteProconnectPgDatabase;
    resolve_delay: number;
  },
  {
    moderation,
    ...message
  }: {
    moderation: { id: number; ticket_id: string | null };
  } & Omit<Parameters<typeof send_crisp_notification>[1], "ticket">,
) {
  const result = await send_crisp_notification(crisp, {
    ...message,
    ticket: parse_ticket_id(moderation.ticket_id),
  });

  if (result.kind === "created") {
    await update_moderation_by_id(pg, {
      id: moderation.id,
      values: { ticket_id: result.session_id },
    });
  }

  await new Promise((resolve) => setTimeout(resolve, resolve_delay));

  await crisp.mark_conversation_as_resolved({ session_id: result.session_id });
}
