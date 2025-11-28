//

import { Root_Layout } from "#src/layouts";
import type { App_Context } from "#src/middleware/context";
import { urls } from "#src/urls";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { ScrollingTitleWall } from "./ScrollingTitleWall";
import { KineticTitle, TerminalTitle } from "./Titles";

//

export default new Hono<App_Context>().get(
  "/",
  jsxRenderer(Root_Layout),
  function GET({ render, redirect, var: { userinfo } }) {
    if (userinfo) {
      return redirect(urls.moderations.$url().pathname);
    }

    const variants = [KineticTitle, ScrollingTitleWall, TerminalTitle];
    const SelectedTitle = variants[Math.floor(Math.random() * variants.length)];

    return render(
      <main class="flex h-full grow flex-col items-center justify-center">
        <div class="relative w-full">
          <SelectedTitle />
        </div>

        <div class="animated delay-2s fadeInLeftBig absolute bottom-14 flex flex-col items-center">
          <button class="agentconnect-button"></button>
          <form method="post" action={urls.auth.login.$url().pathname}>
            <div class="fr-connect-group">
              <button class="fr-connect" type="submit">
                <span class="fr-connect__login">S’identifier avec</span>
                <span class="fr-connect__brand">ProConnect</span>
              </button>
              <p>
                <a
                  href="https://www.proconnect.gouv.fr/"
                  rel="noopener noreferrer"
                  target="_blank"
                  title="Qu’est-ce que ProConnect ? - nouvelle fenêtre"
                >
                  Qu’est-ce que ProConnect ?
                </a>
              </p>
            </div>
          </form>
        </div>
      </main>,
    );
  },
);
