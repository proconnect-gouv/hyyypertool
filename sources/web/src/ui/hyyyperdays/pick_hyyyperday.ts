//

import type { HyyyperDate } from "./hyyyperdate";

//

const MS_PER_DAY = 86_400_000;

//

export function pick_hyyyperday({
  date,
  days_in_month,
  elected_defaults,
}: {
  date: HyyyperDate;
  days_in_month: readonly string[];
  elected_defaults: readonly [string, ...string[]];
}) {
  const [year, month, day] = [
    date.slice(0, 4),
    date.slice(5, 7),
    date.slice(8),
  ];
  const latest_day = days_in_month
    .filter((name) => name <= day)
    .sort()
    .at(-1);

  if (latest_day) {
    return {
      entry: `${year}/${month}/${latest_day}`,
      kind: "month_entry",
    } as const;
  }

  const day_of_year =
    (Date.parse(date) - Date.parse(`${year}-01-01`)) / MS_PER_DAY;

  return {
    entry:
      elected_defaults[day_of_year % elected_defaults.length] ??
      elected_defaults[0],
    kind: "elected_default",
  } as const;
}
