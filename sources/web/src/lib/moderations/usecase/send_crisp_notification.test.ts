//

import { expect, test } from "bun:test";
import { CrispHttpError, parse_ticket_id } from "#src/lib/crisp";
import { send_crisp_notification } from "./send_crisp_notification";

//

const params = {
  email: "user@example.com",
  subject: "subject",
  nickname: "user@example.com",
  content: "content",
  sender: { nickname: "operator" },
};

test("creates a conversation when there is no Crisp session", async () => {
  const crisp = {
    create_conversation: async () => ({ session_id: "session_new" }),
    send_message: async () => ({ fingerprint: 0 }),
  };

  const result = await send_crisp_notification(crisp, {
    ...params,
    ticket: parse_ticket_id(null),
  });

  expect(result).toEqual({ kind: "created", session_id: "session_new" });
});

test("reuses the Crisp session when the conversation still exists", async () => {
  const crisp = {
    create_conversation: async (): Promise<{ session_id: string }> => {
      throw new Error("should not be called");
    },
    send_message: async () => ({ fingerprint: 0 }),
  };

  const result = await send_crisp_notification(crisp, {
    ...params,
    ticket: parse_ticket_id("session_existing"),
  });

  expect(result).toEqual({ kind: "reused", session_id: "session_existing" });
});

test("falls back to a new conversation when the stored session is 404 on Crisp", async () => {
  let send_message_calls = 0;
  const crisp = {
    create_conversation: async () => ({ session_id: "session_new" }),
    send_message: async ({ session_id }: { session_id: string }) => {
      send_message_calls += 1;
      if (session_id === "session_stale") {
        throw new CrispHttpError(
          "https://api.crisp.chat/v1/website/x/conversation/session_stale/message 404 Not Found",
          { http_status: 404, cause: undefined },
        );
      }
      return { fingerprint: 0 };
    },
  };

  const result = await send_crisp_notification(crisp, {
    ...params,
    ticket: parse_ticket_id("session_stale"),
  });

  expect(result).toEqual({ kind: "created", session_id: "session_new" });
  expect(send_message_calls).toBe(2);
});

test("rethrows non-404 errors without falling back", async () => {
  const crisp = {
    create_conversation: async (): Promise<{ session_id: string }> => {
      throw new Error("should not be called");
    },
    send_message: async () => {
      throw new CrispHttpError(
        "https://api.crisp.chat/v1/x 500 Internal Server Error",
        { http_status: 500, cause: undefined },
      );
    },
  };

  await expect(
    send_crisp_notification(crisp, {
      ...params,
      ticket: parse_ticket_id("session_some"),
    }),
  ).rejects.toMatchObject({ http_status: 500 });
});
