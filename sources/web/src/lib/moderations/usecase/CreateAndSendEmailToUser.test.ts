//

import { NotFoundError } from "#src/errors";
import { expect, mock, test } from "bun:test";
import type { RejectedModerationContext } from "../context/rejected";
import { CreateAndSendEmailToUser } from "./CreateAndSendEmailToUser";

//

test("creates conversation and sends email to user with clean dependency injection", async () => {
  const mock_pg = {
    query: {
      users: {
        findFirst: mock().mockResolvedValue({
          given_name: "Pink",
          family_name: "Diamond",
        }),
      },
    },
  };

  const mock_crisp = {
    create_conversation: mock().mockResolvedValue({
      session_id: "session_123456789",
    }),
  };

  const mock_update_moderation_by_id = mock().mockResolvedValue(undefined);
  const mock_respond_to_ticket = mock().mockResolvedValue(undefined);

  const create_and_send_email_to_user = CreateAndSendEmailToUser({
    pg: mock_pg as any,
    respond_to_ticket: mock_respond_to_ticket,
    update_moderation_by_id: mock_update_moderation_by_id,
  });

  const context: RejectedModerationContext = {
    crisp: mock_crisp as any,
    moderation: {
      id: 1,
      user_id: 123,
      ticket_id: null,
    } as any,
    pg: mock_pg as any,
    reason: "test reason",
    resolve_delay: 0,
    subject: "Test Subject",
    userinfo: { email: "test@example.com" } as any,
  };

  const message = {
    message: "Test message",
    reason: "Test reason",
    subject: "Test Subject",
    to: "user@example.com",
  };

  await create_and_send_email_to_user(context, message);

  // Verify the core functionality we can control
  expect(mock_pg.query.users.findFirst).toHaveBeenCalledWith({
    columns: { given_name: true, family_name: true },
    where: expect.any(Function),
  });

  // Verify clean dependency injection for crisp
  expect(mock_crisp.create_conversation).toHaveBeenCalledWith({
    email: "user@example.com",
    subject: "Test Subject",
    nickname: "Pink Diamond",
  });

  // Verify clean dependency injection for update_moderation_by_id
  expect(mock_update_moderation_by_id).toHaveBeenCalledWith(1, {
    ticket_id: "session_123456789",
  });

  // Verify clean dependency injection for respond_to_ticket
  expect(mock_respond_to_ticket).toHaveBeenCalledWith(
    {
      ...context,
      moderation: { ...context.moderation, ticket_id: "session_123456789" },
    },
    {
      message: "Test message",
      reason: "Test reason",
      subject: "Test Subject",
      to: "session_123456789",
    },
  );
});

test("throws NotFoundError when user is not found", async () => {
  const mock_pg = {
    query: {
      users: {
        findFirst: mock().mockResolvedValue(null),
      },
    },
  };

  const mock_crisp = {
    create_conversation: mock().mockResolvedValue({
      session_id: "session_123456789",
    }),
  };

  const mock_update_moderation_by_id = mock().mockResolvedValue(undefined);
  const mock_respond_to_ticket = mock().mockResolvedValue(undefined);

  const create_and_send_email_to_user = CreateAndSendEmailToUser({
    pg: mock_pg as any,
    respond_to_ticket: mock_respond_to_ticket,
    update_moderation_by_id: mock_update_moderation_by_id,
  });

  const context: RejectedModerationContext = {
    crisp: mock_crisp as any,
    moderation: {
      id: 1,
      user_id: 999999,
      ticket_id: null,
    } as any,
    pg: mock_pg as any,
    reason: "test reason",
    resolve_delay: 0,
    subject: "Test Subject",
    userinfo: { email: "test@example.com" } as any,
  };

  const message = {
    message: "Test message",
    reason: "Test reason",
    subject: "Test Subject",
    to: "user@example.com",
  };

  await expect(
    async () => await create_and_send_email_to_user(context, message),
  ).toThrow(NotFoundError);
});
