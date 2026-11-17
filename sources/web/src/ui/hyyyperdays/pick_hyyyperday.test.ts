//

import { expect, test } from "bun:test";
import { hyyyperdate } from "./hyyyperdate";
import { pick_hyyyperday } from "./pick_hyyyperday";

//

const ELECTED = ["2023/11/11", "2026/12/01"] as const;

function pick(date: string, days_in_month: string[]) {
  return pick_hyyyperday({
    date: hyyyperdate.parse(date),
    days_in_month,
    elected_defaults: ELECTED,
  });
}

//

test("picks the latest day of the month already started", () => {
  expect(pick("2026-12-25", ["01", "24", "26"])).toEqual({
    entry: "2026/12/24",
    kind: "month_entry",
  });
});

test("picks a day starting today", () => {
  expect(pick("2026-12-24", ["01", "24"])).toEqual({
    entry: "2026/12/24",
    kind: "month_entry",
  });
});

test("falls back to an elected default before the month's first entry", () => {
  expect(pick("2026-12-10", ["24"])).toEqual({
    entry: "2026/12/01",
    kind: "elected_default",
  });
});

test("rotates the elected defaults day by day when the month has no entry", () => {
  expect([pick("2026-01-01", []), pick("2026-01-02", [])]).toEqual([
    { entry: "2023/11/11", kind: "elected_default" },
    { entry: "2026/12/01", kind: "elected_default" },
  ]);
});
