//

import type { CrispApi } from "#src/lib/crisp";
import type { User } from "@proconnect-gouv/proconnect.crisp/types";

//

export async function send_crisp_notification(
  crisp: CrispApi,
  params: {
    ticket_id?: string;
    email: string;
    subject: string;
    nickname: string;
    content: string;
    sender: Partial<User>;
  },
): Promise<{ session_id: string }> {
  async function create_conversation() {
    return (
      await crisp.create_conversation({
        email: params.email,
        subject: params.subject,
        nickname: params.nickname,
      })
    ).session_id;
  }

  let session_id = params.ticket_id ?? (await create_conversation());

  try {
    await crisp.send_message({
      session_id,
      content: params.content,
      user: params.sender,
    });
  } catch (error) {
    // fetch_crisp throws plain Errors with no status field, so a stale
    // (deleted on Crisp's side) ticket_id is detected by matching " 404 "
    // in the message text.
    if (
      params.ticket_id === undefined ||
      !(error instanceof Error) ||
      !/ 404 /.test(error.message)
    ) {
      throw error;
    }
    session_id = await create_conversation();
    await crisp.send_message({
      session_id,
      content: params.content,
      user: params.sender,
    });
  }

  return { session_id };
}
