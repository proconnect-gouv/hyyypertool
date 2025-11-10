import { type get_crisp_mail, is_crisp_ticket } from "#src/lib/crisp";
import type { Config } from "#src/lib/crisp";
import { to } from "await-to-js";

export function GetCripsFromSessionId({
  fetch_crisp_mail,
  crisp_config,
}: {
  fetch_crisp_mail: typeof get_crisp_mail;
  crisp_config: Config;
}) {
  return async function get_crisp_from_session_id({
    session_id,
    limit = 3,
  }: {
    session_id: string;
    limit?: number;
  }) {
    if (!is_crisp_ticket(session_id)) throw new Error("session_id is required");

    const [err_crisp, crisp] = await to(
      fetch_crisp_mail(crisp_config, { session_id }),
    );

    if (err_crisp) throw err_crisp;
    const { conversation, messages } = crisp;

    return {
      conversation,
      messages: messages.slice(-limit),
      session_id,
      show_more: messages.length > limit,
      subject: conversation.meta.subject ?? "",
    };
  };
}

export type GetCripsFromSessionIdHandler = ReturnType<
  typeof GetCripsFromSessionId
>;
