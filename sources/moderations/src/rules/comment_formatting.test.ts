//

import { expect, test } from "bun:test";
import { append_comment } from "./comment_formatting";

//

test("append_comment adds to null comment", () => {
  const result = append_comment(null, {
    type: "VALIDATED",
    created_by: "test@example.com",
  });

  expect(result).toContain("Validé par test@example.com");
});

test("append_comment adds to existing comment", () => {
  const result = append_comment("existing comment", {
    type: "REJECTED",
    created_by: "test@example.com",
    reason: "Invalid request",
  });

  expect(result).toContain("existing comment");
  expect(result).toContain("Rejeté par test@example.com");
  expect(result).toContain("Invalid request");
});
