//

import { fetch_crisp } from "@proconnect-gouv/proconnect.crisp/client";
import type {
  CreateConversationRoute,
  GetConversationRoute,
  GetConversationStateRoute,
  GetMessagesInAConversationRoute,
  OperatorsRouter,
  SendMessageInAConversationRoute,
  UpdateConversationMetaRoute,
  UpdateConversationStateRoute,
} from "@proconnect-gouv/proconnect.crisp/router";
import type {
  Config,
  ConversationMeta,
  ConversationState,
  User,
} from "@proconnect-gouv/proconnect.crisp/types";
import { z } from "zod";
import { CrispMessageSchema } from "./types";

//

export const CrispOutgoingMessageTypeSchema = z.enum(["note", "text"]);
export type CrispOutgoingMessageType = z.infer<
  typeof CrispOutgoingMessageTypeSchema
>;

export type CrispConfig = Config & { plugin_urn: `urn:${string}` };
export type CrispSender = Pick<User, "nickname"> &
  Partial<Pick<User, "user_id">>;

export class CrispHttpError extends Error {
  readonly http_status: number;

  constructor(
    message: string,
    { http_status, cause }: { http_status: number; cause: unknown },
  ) {
    super(message, { cause });
    this.name = "CrispHttpError";
    this.http_status = http_status;
  }
}

export function crisp_api(config: CrispConfig) {
  return {
    create_conversation: create_conversation(config),
    get_conversation: get_conversation(config),
    get_conversation_state: get_conversation_state(config),
    get_messages: get_messages(config),
    get_user: get_operator(config),
    mark_conversation_as_resolved: change_conversation_state(
      config,
      "resolved",
    ),
    mark_conversation_as_unresolved: change_conversation_state(
      config,
      "unresolved",
    ),
    send_message: send_message(config),
  };
}

export type CrispApi = ReturnType<typeof crisp_api>;

//

// fetch_crisp throws plain Errors formatted as "${url} ${status} ${statusText}".
async function crisp_request<T>(request: Promise<T>): Promise<T> {
  try {
    return await request;
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    const status = / (\d{3}) /.exec(error.message)?.[1];
    if (status === undefined) throw error;
    throw new CrispHttpError(error.message, {
      http_status: Number(status),
      cause: error,
    });
  }
}

function get_conversation(config: Config) {
  return async function get_conversation({
    session_id,
  }: {
    session_id: string;
  }) {
    return crisp_request(
      fetch_crisp<GetConversationRoute>(config, {
        endpoint: `/v1/website/${config.website_id}/conversation/${session_id}`,
        method: "GET",
        searchParams: {},
      }),
    );
  };
}

function get_conversation_state(config: Config) {
  return async function get_conversation_state({
    session_id,
  }: {
    session_id: string;
  }) {
    const { state } = await crisp_request(
      fetch_crisp<GetConversationStateRoute>(config, {
        endpoint: `/v1/website/${config.website_id}/conversation/${session_id}/state`,
        method: "GET",
        searchParams: {},
      }),
    );
    return state;
  };
}

function get_messages(config: Config) {
  return async function get_messages({
    session_id,
    timestamp_before,
  }: {
    session_id: string;
    timestamp_before?: number;
  }) {
    const messages = await crisp_request(
      fetch_crisp<GetMessagesInAConversationRoute>(config, {
        endpoint: `/v1/website/${config.website_id}/conversation/${session_id}/messages`,
        method: "GET",
        searchParams:
          timestamp_before === undefined
            ? {}
            : { timestamp_before: String(timestamp_before) },
      }),
    );
    return z.array(CrispMessageSchema).parse(messages);
  };
}

function create_conversation(config: Config) {
  return async function create_conversation({
    email,
    nickname,
    subject,
  }: Pick<ConversationMeta, "email" | "nickname" | "subject">) {
    const { session_id } = await crisp_request(
      fetch_crisp<CreateConversationRoute>(config, {
        endpoint: `/v1/website/${config.website_id}/conversation`,
        method: "POST",
        searchParams: {},
      }),
    );

    await crisp_request(
      fetch_crisp<UpdateConversationMetaRoute>(config, {
        endpoint: `/v1/website/${config.website_id}/conversation/${session_id}/meta`,
        method: "PATCH",
        searchParams: {},
        body: {
          email,
          nickname: nickname || email,
          segments: ["email", "moderation"],
          subject,
        },
      }),
    );

    return { session_id };
  };
}

function send_message(config: CrispConfig) {
  return async function send_message({
    content,
    session_id,
    type = "text",
    user,
  }: {
    content: string;
    session_id: string;
    type?: CrispOutgoingMessageType;
    user: CrispSender;
  }) {
    return crisp_request(
      fetch_crisp<SendMessageInAConversationRoute>(config, {
        endpoint: `/v1/website/${config.website_id}/conversation/${session_id}/message`,
        method: "POST",
        searchParams: {},
        body: {
          content,
          from: "operator",
          origin: config.plugin_urn,
          // Crisp accepts private notes; proconnect.crisp only types "text".
          type: type as "text",
          user,
        },
      }),
    );
  };
}

function change_conversation_state(config: Config, state: ConversationState) {
  return async function change_conversation_state({
    session_id,
  }: {
    session_id: string;
  }) {
    await crisp_request(
      fetch_crisp<UpdateConversationStateRoute>(config, {
        endpoint: `/v1/website/${config.website_id}/conversation/${session_id}/state`,
        method: "PATCH",
        searchParams: {},
        body: { state },
      }),
    );
  };
}

function get_operator(config: Config) {
  return async function get_user({ email }: { email: string }) {
    const operators = await crisp_request(
      fetch_crisp<OperatorsRouter>(config, {
        endpoint: `/v1/website/${config.website_id}/operators/list`,
        method: "GET",
        searchParams: {},
      }),
    );

    const operator = operators.find(({ details }) => details.email === email);

    if (!operator) throw new Error(`Operator "${email}" not found.`);

    const { first_name, last_name, user_id } = operator.details;
    const last_name_initial = last_name.at(0);

    return {
      user_id,
      nickname: last_name_initial
        ? `${first_name} ${last_name_initial}.`
        : first_name,
    };
  };
}
