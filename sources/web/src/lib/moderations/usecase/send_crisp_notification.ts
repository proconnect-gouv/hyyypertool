//

import type { CrispApi } from "#src/lib/crisp";

//

export async function send_crisp_notification(
  crisp: CrispApi,
  params: {
    ticket_id?: string;
    email: string;
    subject: string;
    nickname: string;
    content: string;
    sender: { nickname: string; email?: string };
  },
): Promise<{ session_id: string }> {
  const session_id =
    params.ticket_id ??
    (
      await crisp.create_conversation({
        email: params.email,
        subject: params.subject,
        nickname: params.nickname,
      })
    ).session_id;

  await crisp.send_message({
    session_id,
    content: params.content,
    user: params.sender,
  });

  return { session_id };
}
