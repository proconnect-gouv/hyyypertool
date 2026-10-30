//

import { fetch_crisp } from "@proconnect-gouv/proconnect.crisp/client";
import type {
  CreateConversationRoute,
  OperatorsRouter,
  SendMessageInAConversationRoute,
  UpdateConversationMetaRoute,
  UpdateConversationStateRoute,
} from "@proconnect-gouv/proconnect.crisp/router";
import type {
  Config,
  ConversationMeta,
  User,
} from "@proconnect-gouv/proconnect.crisp/types";

export function crisp_api(config: Config) {
  return {
    create_conversation: create_conversation(config),
    get_user: get_user_info(config),
    mark_conversation_as_resolved: mark_conversation_as_resolved(config),
    send_message: send_message(config),
  };
}

export type CrispApi = ReturnType<typeof crisp_api>;

//

function create_conversation(config: Config) {
  return async function create_conversation({
    email,
    nickname,
    subject,
  }: Pick<ConversationMeta, "email" | "nickname" | "subject">) {
    const { session_id } = await fetch_crisp<CreateConversationRoute>(config, {
      endpoint: `/v1/website/${config.website_id}/conversation`,
      method: "POST",
      searchParams: {},
    });

    await fetch_crisp<UpdateConversationMetaRoute>(config, {
      endpoint: `/v1/website/${config.website_id}/conversation/${session_id}/meta`,
      method: "PATCH",
      searchParams: {},
      body: {
        email,
        nickname,
        segments: ["email", "moderation"],
        subject,
      },
    });

    return { session_id };
  };
}

function send_message(config: Config) {
  return async function send_message({
    content,
    session_id,
    user,
  }: {
    content: string;
    user: Partial<User>;
    session_id: string;
  }) {
    return fetch_crisp<SendMessageInAConversationRoute>(config, {
      endpoint: `/v1/website/${config.website_id}/conversation/${session_id}/message`,
      method: "POST",
      searchParams: {},
      body: {
        content,
        from: "operator",
        origin: config.plugin_urn as `urn:${string}`,
        type: "text",
        user,
      },
    });
  };
}

function mark_conversation_as_resolved(config: Config) {
  return async function mark_conversation_as_resolved({
    session_id,
  }: {
    session_id: string;
  }) {
    await fetch_crisp<UpdateConversationStateRoute>(config, {
      endpoint: `/v1/website/${config.website_id}/conversation/${session_id}/state`,
      method: "PATCH",
      searchParams: {},
      body: { state: "resolved" },
    });
  };
}

export function get_user_info(config: Config) {
  return async function get_user({ email }: { email: string }) {
    const operators = await fetch_crisp<OperatorsRouter>(config, {
      endpoint: `/v1/website/${config.website_id}/operators/list`,
      method: "GET",
      searchParams: {},
    });

    const operator = operators.find(({ details }) => details.email === email);

    if (!operator) throw new Error(`Operator "${email}" not found.`);

    return {
      user_id: operator.details.user_id,
      nickname: `${operator.details.first_name} ${operator.details.last_name[0]}.`,
    } as User;
  };
}
