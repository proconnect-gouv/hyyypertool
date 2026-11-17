//

import { z } from "zod";

//

export type HyyyperDate = z.infer<typeof hyyyperdate>;

//

export const hyyyperdate = z.iso.date().brand<"HyyyperDate">();

const PARIS_DATE = new Intl.DateTimeFormat("en-CA", {
  day: "2-digit",
  month: "2-digit",
  timeZone: "Europe/Paris",
  year: "numeric",
});

//

export function paris_date(now: Date) {
  return hyyyperdate.parse(PARIS_DATE.format(now));
}
