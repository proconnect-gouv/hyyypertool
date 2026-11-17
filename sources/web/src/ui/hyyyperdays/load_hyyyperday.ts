//

import type { FC } from "hono/jsx";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { z } from "zod";
import { elected_defaults } from "./defaults";
import type { HyyyperDate } from "./hyyyperdate";
import { pick_hyyyperday } from "./pick_hyyyperday";

//

export interface HyyyperDayProps {
  assets_path: string;
  nonce: string;
}

//

const entry_module = z.object({
  default: z.custom<FC<HyyyperDayProps>>(
    (value) => typeof value === "function",
  ),
});

const TWO_DIGITS = /^\d{2}$/;

//

export async function load_hyyyperday(date: HyyyperDate) {
  const { entry } = pick_hyyyperday({
    date,
    days_in_month: await read_days_in_month(date),
    elected_defaults,
  });
  const module: unknown = await import(
    join(import.meta.dirname, entry, "index.tsx")
  );

  return { entry, HyyyperDay: entry_module.parse(module).default };
}

//

async function read_days_in_month(date: HyyyperDate) {
  const month_dir = join(
    import.meta.dirname,
    date.slice(0, 4),
    date.slice(5, 7),
  );
  const names = await readdir(month_dir).catch((error: unknown) => {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return [];
    }
    throw error;
  });

  return names.filter((name) => TWO_DIGITS.test(name));
}
