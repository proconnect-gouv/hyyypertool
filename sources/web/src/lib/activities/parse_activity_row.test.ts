//

import { expect, test } from "bun:test";
import {
  parse_activity_row,
  type KnownActivityContexts,
} from "./parse_activity_row";

//

test("known: a runtime action with a valid context", () => {
  const context: KnownActivityContexts["domain.verified"] = {
    inputs: { domain: "unicorn.xyz", verification_type: "verified" },
    outcome: { email_domain_id: 1, replaced_verification_types: [] },
  };

  expect(parse_activity_row({ action: "domain.verified", context })).toEqual({
    kind: "known",
    action: "domain.verified",
    context,
  });
});

test("known: hyyypertool's own action, unknown keys dropped", () => {
  expect(
    parse_activity_row({
      action: "domain.refused",
      context: {
        inputs: { domain: "unicorn.xyz", verification_type: "refused" },
        outcome: {
          email_domain_id: 2,
          from_a_newer_writer: true,
          replaced_verification_types: ["not_verified_yet"],
        },
      },
    }),
  ).toEqual({
    kind: "known",
    action: "domain.refused",
    context: {
      inputs: { domain: "unicorn.xyz", verification_type: "refused" },
      outcome: {
        email_domain_id: 2,
        replaced_verification_types: ["not_verified_yet"],
      },
    },
  });
});

test("unknown_action: an action neither map defines", () => {
  const context = { inputs: {}, outcome: {} };

  expect(parse_activity_row({ action: "domain.archived", context })).toEqual({
    kind: "unknown_action",
    action: "domain.archived",
    context,
  });
});

test("unknown_action: an inherited object key is not an action", () => {
  expect(
    parse_activity_row({ action: "toString", context: null }),
  ).toMatchObject({ kind: "unknown_action" });
});

test("invalid_context: a known action whose context breaks its schema", () => {
  const context = { inputs: { domain: "unicorn.xyz" }, outcome: {} };

  expect(
    parse_activity_row({ action: "domain.refused", context }),
  ).toMatchObject({
    kind: "invalid_context",
    action: "domain.refused",
    context,
    error: expect.any(Error),
  });
});
