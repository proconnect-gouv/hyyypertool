import type { CrispApi } from "#src/lib/crisp";

export async function get_crisp_conversation(
  crisp: Pick<CrispApi, "get_conversation">,
  {
    session_id,
    limit,
  }: {
    session_id: string;
    limit: number;
  },
) {
  const { conversation, messages } = await crisp.get_conversation({
    session_id,
  });

  return {
    conversation,
    messages: messages.slice(-limit),
    session_id,
    show_more: messages.length > limit,
    subject: conversation.meta.subject,
  };
}

export type CrispConversation = Awaited<
  ReturnType<typeof get_crisp_conversation>
>;
