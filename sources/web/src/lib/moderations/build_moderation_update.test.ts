//

import { describe, expect, test } from "bun:test";
import { build_moderation_update } from "./build_moderation_update";

//

describe("build_moderation_update", () => {
  test("builds update with username and email", () => {
    const result = build_moderation_update({
      comment: "existing comment",
      userinfo: {
        email: "test@example.com",
        given_name: "Jean",
        usual_name: "Dupont",
      },
      reason: "Test reason",
      type: "VALIDATED",
    });

    expect(result.moderated_by).toBe("Jean Dupont <test@example.com>");
    expect(result.comment).toContain("Test reason");
    expect(result.comment).toContain("Validé par");
    expect(result.moderated_at).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  test("appends comment to existing comment", () => {
    const result = build_moderation_update({
      comment: "Previous comment",
      userinfo: {
        email: "mod@example.com",
        given_name: "Jane",
        usual_name: "Doe",
      },
      reason: "New update",
      type: "REJECTED",
    });

    expect(result.comment).toContain("Previous comment");
    expect(result.comment).toContain("New update");
    expect(result.comment).toContain("Rejeté par");
  });

  test("handles null comment", () => {
    const result = build_moderation_update({
      comment: null,
      userinfo: {
        email: "admin@example.com",
        given_name: "Admin",
        usual_name: "User",
      },
      reason: "First comment",
      type: "VALIDATED",
    });

    expect(result.comment).toContain("First comment");
    expect(result.comment).toContain("Validé par");
  });
});
