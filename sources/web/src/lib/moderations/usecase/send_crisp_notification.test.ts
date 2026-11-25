//

import { expect, test } from "bun:test";
import { CrispHttpError, type CrispApi } from "#src/lib/crisp";
import { send_crisp_notification } from "./send_crisp_notification";

//

const params = {
  email: "user@example.com",
  subject: "subject",
  nickname: "user@example.com",
  content: "content",
  sender: { nickname: "operator" },
};

test("creates a conversation when no ticket_id is given", async () => {
  const crisp = {
    create_conversation: async () => ({ session_id: "new_session" }),
    send_message: async () => {},
  } as unknown as CrispApi;

  const result = await send_crisp_notification(crisp, params);

  expect(result).toEqual({ session_id: "new_session" });
});

test("reuses ticket_id when the Crisp conversation still exists", async () => {
  const crisp = {
    create_conversation: async () => {
      throw new Error("should not be called");
    },
    send_message: async () => {},
  } as unknown as CrispApi;

  const result = await send_crisp_notification(crisp, {
    ...params,
    ticket_id: "existing_session",
  });

  expect(result).toEqual({ session_id: "existing_session" });
});

test("falls back to a new conversation when the stored ticket_id is 404 on Crisp", async () => {
  let send_message_calls = 0;
  const crisp = {
    create_conversation: async () => ({ session_id: "new_session" }),
    send_message: async ({ session_id }: { session_id: string }) => {
      send_message_calls += 1;
      if (session_id === "stale_session") {
        throw new CrispHttpError(
          "https://api.crisp.chat/v1/website/x/conversation/stale_session/message 404 Not Found",
          { http_status: 404, cause: undefined },
        );
      }
    },
  } as unknown as CrispApi;

  const result = await send_crisp_notification(crisp, {
    ...params,
    ticket_id: "stale_session",
  });

  expect(result).toEqual({ session_id: "new_session" });
  expect(send_message_calls).toBe(2);
});

test("rethrows non-404 errors without falling back", async () => {
  const crisp = {
    create_conversation: async () => {
      throw new Error("should not be called");
    },
    send_message: async () => {
      throw new CrispHttpError(
        "https://api.crisp.chat/v1/x 500 Internal Server Error",
        { http_status: 500, cause: undefined },
      );
    },
  } as unknown as CrispApi;

  await expect(
    send_crisp_notification(crisp, { ...params, ticket_id: "some_session" }),
  ).rejects.toMatchObject({ http_status: 500 });
});
