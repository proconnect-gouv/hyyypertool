//

import { readdir } from "node:fs/promises";
import { join } from "node:path";

//

const FOUR_DIGITS = /^\d{4}$/;

//

export async function list_hyyyperdays() {
  const root = import.meta.dirname;
  const years = (await readdir(root)).filter((name) => FOUR_DIGITS.test(name));
  const entries: string[] = [];

  for (const year of years) {
    for (const month of await readdir(join(root, year))) {
      for (const day of await readdir(join(root, year, month))) {
        entries.push(`${year}/${month}/${day}`);
      }
    }
  }

  return entries.sort();
}
