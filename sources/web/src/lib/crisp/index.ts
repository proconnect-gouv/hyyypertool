//

export * from "./api";
export * from "./links";
export * from "./session_id";
export * from "./types";

// Re-export from index
import { fetch_crisp } from "@proconnect-gouv/proconnect.crisp/client";
import type {
  GetConversationRoute,
  GetMessagesInAConversationRoute,
} from "@proconnect-gouv/proconnect.crisp/router";
import type { Config } from "@proconnect-gouv/proconnect.crisp/types";
import type { CrispApi } from "./api";
import { CrispSessionId } from "./session_id";

//

export type CrispApiCradle = {
  crisp: CrispApi;
};

export function is_crisp_ticket(session_id: string) {
  return CrispSessionId.safeParse(session_id).success;
}

//

export async function get_crisp_mail(
  config: Config,
  { session_id }: { session_id: string },
) {
  const conversation = await fetch_crisp<GetConversationRoute>(config, {
    endpoint: `/v1/website/${config.website_id}/conversation/${session_id}`,
    method: "GET",
    searchParams: {},
  });

  const messages = await fetch_crisp<GetMessagesInAConversationRoute>(config, {
    endpoint: `/v1/website/${config.website_id}/conversation/${session_id}/messages`,
    method: "GET",
    searchParams: {},
  });

  return { conversation, messages };
}

export type GetCrispMailDto = Awaited<ReturnType<typeof get_crisp_mail>>;
