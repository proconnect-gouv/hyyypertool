//

import type { CrispApi, parse_ticket_id } from "#src/lib/crisp";
import type { User } from "@proconnect-gouv/proconnect.crisp/types";
import { match } from "ts-pattern";

//

export async function send_crisp_notification(
  crisp: Pick<CrispApi, "create_conversation" | "send_message">,
  params: {
    ticket: ReturnType<typeof parse_ticket_id>;
    email: string;
    subject: string;
    nickname: string;
    content: string;
    sender: Partial<User>;
  },
): Promise<
  | { kind: "created"; session_id: string }
  | { kind: "reused"; session_id: string }
> {
  async function send(session_id: string) {
    await crisp.send_message({
      session_id,
      content: params.content,
      user: params.sender,
    });
  }

  async function create_and_send() {
    const { session_id } = await crisp.create_conversation({
      email: params.email,
      subject: params.subject,
      nickname: params.nickname,
    });
    await send(session_id);
    return { kind: "created", session_id } as const;
  }

  return match(params.ticket)
    .with({ kind: "no_crisp_session" }, create_and_send)
    .with({ kind: "crisp_session" }, async ({ session_id }) => {
      try {
        await send(session_id);
        return { kind: "reused", session_id } as const;
      } catch (error) {
        // fetch_crisp throws plain Errors with no status field, so a stale
        // (deleted on Crisp's side) ticket_id is detected by matching " 404 "
        // in the message text.
        if (!(error instanceof Error) || !/ 404 /.test(error.message)) {
          throw error;
        }
        return create_and_send();
      }
    })
    .exhaustive();
}
