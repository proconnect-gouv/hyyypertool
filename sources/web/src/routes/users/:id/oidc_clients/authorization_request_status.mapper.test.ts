//

import { expect, test } from "bun:test";
import { authorization_request_status_label } from "./authorization_request_status.mapper";

//

const now = new Date("2222-01-01T00:00:00.000Z");

test.each([
  [
    {
      created_at: "2221-12-31 22:00:00+00",
      interaction_cid: "🦄 cid",
      outcome: "succeeded",
    },
    "Terminée",
  ],
  [
    {
      created_at: "2221-12-31 22:00:00+00",
      interaction_cid: null,
      outcome: "succeeded",
    },
    "Sans interaction",
  ],
  [
    {
      created_at: "2221-12-31 22:59:59+00",
      interaction_cid: "🦄 cid",
      outcome: null,
    },
    "Interrompue",
  ],
  [
    {
      created_at: "2221-12-31 23:00:01+00",
      interaction_cid: "🦄 cid",
      outcome: null,
    },
    "—",
  ],
  [
    {
      created_at: "2221-12-31 22:00:00+00",
      interaction_cid: null,
      outcome: null,
    },
    "—",
  ],
  [
    {
      created_at: "2221-12-31 22:00:00+00",
      interaction_cid: null,
      outcome: "failed",
    },
    "—",
  ],
])(
  "$interaction_cid created at $created_at with outcome $outcome",
  ({ created_at, interaction_cid, outcome }, expected) => {
    const actual = authorization_request_status_label({
      created_at,
      interaction_cid,
      now,
      outcome,
    });

    expect(actual).toBe(expected);
  },
);
