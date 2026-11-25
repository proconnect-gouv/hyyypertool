import type { CrispApi, CrispSessionId } from "#src/lib/crisp";

export async function get_crisp_conversation(
  crisp: Pick<CrispApi, "get_conversation">,
  {
    limit,
    session_id,
  }: {
    limit: number;
    session_id: CrispSessionId;
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
