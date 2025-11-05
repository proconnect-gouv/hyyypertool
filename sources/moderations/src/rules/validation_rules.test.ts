//

import { expect, test } from "bun:test";
import { can_approve, can_reject, can_reprocess } from "./validation_rules";

//

test("can_approve returns true for pending", () => {
  expect(can_approve({ status: "pending" })).toBe(true);
});

test("can_approve returns false for approved", () => {
  expect(
    can_approve({
      status: "approved",
      approved_at: new Date(),
      approved_by: "user@example.com",
    }),
  ).toBe(false);
});

test("can_reject returns true for pending", () => {
  expect(can_reject({ status: "pending" })).toBe(true);
});

test("can_reprocess returns true for approved", () => {
  expect(
    can_reprocess({
      status: "approved",
      approved_at: new Date(),
      approved_by: "user@example.com",
    }),
  ).toBe(true);
});

test("can_reprocess returns false for pending", () => {
  expect(can_reprocess({ status: "pending" })).toBe(false);
});
