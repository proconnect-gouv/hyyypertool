//

import { expect, test } from "bun:test";
import { hyyyperdate, paris_date } from "./hyyyperdate";

//

test("reads today in Europe/Paris", () => {
  expect([
    paris_date(new Date("2026-11-30T23:30:00Z")),
    paris_date(new Date("2027-06-30T22:30:00Z")),
  ]).toEqual([
    hyyyperdate.parse("2026-12-01"),
    hyyyperdate.parse("2027-07-01"),
  ]);
});
