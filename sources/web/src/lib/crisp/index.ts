//

export * from "./api";
export * from "./links";
export * from "./types";

// Re-export from index
import { fetch_crisp } from "@proconnect-gouv/proconnect.crisp/client";
import type {
  GetConversationRoute,
  GetMessagesInAConversationRoute,
} from "@proconnect-gouv/proconnect.crisp/router";
import type { Config } from "@proconnect-gouv/proconnect.crisp/types";
import { z } from "zod";
import type { CrispApi } from "./api";

//

export type CrispApiCradle = {
  crisp: CrispApi;
};

export function is_crisp_ticket(session_id: string | number) {
  return z.string().startsWith("session_").safeParse(session_id).success;
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

export type get_crisp_mail_dto = Awaited<ReturnType<typeof get_crisp_mail>>;
