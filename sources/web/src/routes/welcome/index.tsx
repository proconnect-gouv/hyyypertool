//

import config from "#src/config";
import { RootLayout } from "#src/layouts";
import type { App_Context } from "#src/middleware/context";
import { connect, connect_group, CONNECT_LOGO_URL } from "#src/ui/connect";
import { urls } from "#src/urls";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";

//

export default new Hono<App_Context>().get(
  "/",
  jsxRenderer(RootLayout),
  function GET({ render, redirect, var: { nonce, userinfo } }) {
    if (userinfo) {
      return redirect(urls.moderations.$url().pathname);
    }

    return render(
      <main class="flex h-full grow flex-col items-center justify-center">
        <h1 class="text-5xl font-bold drop-shadow-lg">
          <hyyyper-title>Bonjour Hyyypertool !</hyyyper-title>
          <script
            nonce={nonce}
            src={`${config.PUBLIC_ASSETS_PATH}/routes/welcome/hyyypertitle.client.js`}
            type="module"
          ></script>
        </h1>

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
      </main>,
    );
  },
);
