import type { CrispApi, CrispMessage, CrispSessionId } from "#src/lib/crisp";
import type { ConversationState } from "@proconnect-gouv/proconnect.crisp/types";

//

const MESSAGE_PAGE_SIZE = 10;

export interface CrispMessagesPage {
  messages: CrispMessage[];
  older: { before: number } | null;
}

export interface CrispConversation {
  page: CrispMessagesPage;
  session_id: CrispSessionId;
  state: ConversationState;
  subject: string | undefined;
}

export async function get_crisp_conversation(
  crisp: Pick<
    CrispApi,
    "get_conversation" | "get_conversation_state" | "get_messages"
  >,
  { session_id }: { session_id: CrispSessionId },
): Promise<CrispConversation> {
  const [conversation, state, page] = await Promise.all([
    crisp.get_conversation({ session_id }),
    crisp.get_conversation_state({ session_id }),
    get_crisp_messages(crisp, { session_id }),
  ]);

  return {
    page,
    session_id,
    state,
    subject: conversation.meta.subject,
  };
}

export async function get_crisp_messages(
  crisp: Pick<CrispApi, "get_messages">,
  {
    before,
    session_id,
  }: {
    before?: number;
    session_id: CrispSessionId;
  },
): Promise<CrispMessagesPage> {
  const batch = await crisp.get_messages({
    session_id,
    timestamp_before: before,
  });
  const messages = batch.slice(-MESSAGE_PAGE_SIZE);
  const oldest = messages.at(0);

  return {
    messages,
    older:
      oldest && batch.length >= MESSAGE_PAGE_SIZE
        ? { before: oldest.timestamp }
        : null,
  };
}
