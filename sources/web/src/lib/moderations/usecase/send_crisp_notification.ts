//

import {
  CrispHttpError,
  type CrispApi,
  type CrispSender,
} from "#src/lib/crisp";

//

export async function send_crisp_notification(
  crisp: CrispApi,
  params: {
    ticket_id?: string;
    email: string;
    subject: string;
    nickname: string;
    content: string;
    sender: CrispSender;
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
    // A stale ticket_id (deleted on Crisp's side) answers 404.
    if (
      params.ticket_id === undefined ||
      !(error instanceof CrispHttpError) ||
      error.http_status !== 404
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
