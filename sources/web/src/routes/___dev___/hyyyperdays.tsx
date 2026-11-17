//

import { RootLayout } from "#src/layouts";
import type { AppContext } from "#src/middleware/context";
import {
  elected_defaults,
  hyyyperdate,
  list_hyyyperdays,
  load_hyyyperday,
} from "#src/ui/hyyyperdays";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";

//

export default new Hono<AppContext>().get(
  "/",
  jsxRenderer(RootLayout),
  async function GET({ env, render, var: { nonce } }) {
    const hyyyperdays = await Promise.all(
      (await list_hyyyperdays()).map(async (entry) => {
        const date = entry.replaceAll("/", "-");
        const { HyyyperDay } = await load_hyyyperday(hyyyperdate.parse(date));
        return { date, entry, HyyyperDay };
      }),
    );
    const elected: readonly string[] = elected_defaults;

    return render(
      <main class="mx-auto flex max-w-5xl flex-col gap-8 p-8">
        <h1 class="text-3xl font-bold">HyyyperDays</h1>
        <ul class="grid gap-8">
          {hyyyperdays.map(({ date, entry, HyyyperDay }) => (
            <li
              class="flex flex-col items-center gap-4 overflow-hidden border border-gray-300 p-8"
              data-hyyyperday={entry}
            >
              <HyyyperDay assets_path={env.PUBLIC_ASSETS_PATH} nonce={nonce} />
              <a href={`/?hyyyperdate=${date}`}>
                {entry}
                {elected.includes(entry) ? " · défaut élu" : ""}
              </a>
            </li>
          ))}
        </ul>
      </main>,
    );
  },
);
