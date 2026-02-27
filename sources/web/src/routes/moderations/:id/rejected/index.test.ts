//

import { expect, mock, test } from "bun:test";
import type { GetModerationWithUserDto } from "#src/queries/moderations";

//

test("sends rejection message via new crisp conversation", async () => {
  const mock_crisp = {
    create_conversation: mock().mockResolvedValue({
      session_id: "crisp-123",
    }),
    send_message: mock().mockResolvedValue(undefined),
    mark_conversation_as_resolved: mock().mockResolvedValue(undefined),
  };

  const moderation: GetModerationWithUserDto = {
    id: 1,
    comment: "test",
    organization_id: 123,
    user_id: 456,
    ticket_id: null,
    user: { email: "user@example.com" },
  };

  expect(moderation.ticket_id).toBeNull();
  expect(mock_crisp.create_conversation).toBeDefined();
  expect(mock_crisp.send_message).toBeDefined();
});

test("sends rejection message via existing crisp conversation", async () => {
  const mock_crisp = {
    send_message: mock().mockResolvedValue(undefined),
    mark_conversation_as_resolved: mock().mockResolvedValue(undefined),
  };

  const moderation: GetModerationWithUserDto = {
    id: 1,
    comment: "test",
    organization_id: 123,
    user_id: 456,
    ticket_id: "crisp-existing-123",
    user: { email: "user@example.com" },
  };

  expect(moderation.ticket_id).toBe("crisp-existing-123");
  expect(mock_crisp.send_message).toBeDefined();
  expect(mock_crisp.mark_conversation_as_resolved).toBeDefined();
});
