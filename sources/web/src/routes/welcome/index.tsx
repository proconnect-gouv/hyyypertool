//

import { RootLayout, ThemeToggle } from "#src/layouts";
import type { AppContext } from "#src/middleware/context";
import { connect, connect_group, CONNECT_LOGO_URL } from "#src/ui/connect";
import { hyyyperdate, load_hyyyperday, paris_date } from "#src/ui/hyyyperdays";
import { urls } from "#src/urls";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { z } from "zod";

//

const query_schema = z.object({
  hyyyperdate: hyyyperdate.optional().catch(undefined),
});

//

export default new Hono<AppContext>().get(
  "/",
  jsxRenderer(RootLayout),
  zValidator("query", query_schema),
  async function GET({ env, redirect, render, req, var: { nonce, userinfo } }) {
    if (userinfo) {
      return redirect(urls.moderations.$url().pathname);
    }

    const { hyyyperdate: date = paris_date(new Date()) } = req.valid("query");
    const { entry, HyyyperDay } = await load_hyyyperday(date);

    return render(
      <>
        <div class="fixed top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        <main class="flex h-full grow flex-col items-center justify-center">
          <div data-hyyyperday={entry}>
            <HyyyperDay assets_path={env.PUBLIC_ASSETS_PATH} nonce={nonce} />
          </div>

          <div class="animated delay-2s fadeInLeftBig flex flex-col items-center">
            <button class="agentconnect-button"></button>
            <form method="post" action={urls.auth.login.$url().pathname}>
              <div class={connect_group()}>
                <button
                  class={connect().base()}
                  style={`--connect-bg:${CONNECT_LOGO_URL}`}
                  type="submit"
                >
                  <span class={connect().login()}>S'identifier avec</span>
                  <span class={connect().brand()}>ProConnect</span>
                </button>
                <p>
                  <a
                    href="https://www.proconnect.gouv.fr/"
                    rel="noopener noreferrer"
                    target="_blank"
                    title="Qu'est-ce que ProConnect ? - nouvelle fenêtre"
                  >
                    Qu'est-ce que ProConnect ?
                  </a>
                </p>
              </div>
            </form>
          </div>
        </main>
      </>,
    );
  },
);
