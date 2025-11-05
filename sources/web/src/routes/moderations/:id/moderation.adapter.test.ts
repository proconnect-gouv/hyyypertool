//

import { expect, test } from "bun:test";
import { to_domain_state, to_database_update } from "./moderation.adapter";

//

test("to_domain_state converts pending moderation", () => {
  const db_row = {
    id: 1,
    moderated_at: null,
    moderated_by: null,
    user_id: 1,
    organization_id: 1,
    type: "test",
    comment: null,
    ticket_id: null,
    created_at: "2024-01-01",
  };

  expect(to_domain_state(db_row)).toEqual({ status: "pending" });
});

test("to_domain_state converts approved moderation", () => {
  const db_row = {
    id: 1,
    moderated_at: "2024-01-01T10:00:00Z",
    moderated_by: "John Doe <john@example.com>",
    user_id: 1,
    organization_id: 1,
    type: "test",
    comment: null,
    ticket_id: null,
    created_at: "2024-01-01",
  };

  const result = to_domain_state(db_row);
  expect(result.status).toBe("approved");
  if (result.status === "approved") {
    expect(result.approved_by).toBe("John Doe <john@example.com>");
  }
});

test("to_database_update for approval", () => {
  const update = to_database_update(
    { approve: true, user: "John <john@example.com>" },
    "2024-01-01T10:00:00Z",
  );

  expect(update).toEqual({
    moderated_at: "2024-01-01T10:00:00Z",
    moderated_by: "John <john@example.com>",
  });
});

test("to_database_update for rejection", () => {
  const update = to_database_update(
    { reject: true, user: "John <john@example.com>", reason: "Invalid" },
    "2024-01-01T10:00:00Z",
  );

  expect(update).toEqual({
    moderated_at: "2024-01-01T10:00:00Z",
    moderated_by: "John <john@example.com>",
  });
});
