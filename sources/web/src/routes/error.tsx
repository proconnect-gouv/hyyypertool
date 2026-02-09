//

import { NotFoundError } from "#src/errors";
import { is_htmx_request } from "#src/htmx";
import type { AppContext } from "#src/middleware/context";
import { button } from "#src/ui/button";
import consola from "consola";
import { type Context } from "hono";
import { useRequestContext } from "hono/jsx-renderer";
import { P, match } from "ts-pattern";
import { Youch } from "youch";

//

export function error_handler(error: Error, c: Context) {
  const {
    env: config,
    html,
    notFound,
    render,
    req,
    status,
    var: { sentry },
  } = c as Context<AppContext>;

  return (
    match(error)
      // Handle false negatives here :)
      .with(P.instanceOf(NotFoundError), () => notFound())
      // OK this should not happen...
      .otherwise((error) => {
        consola.error(error);
        sentry.captureException(error);

        //

        status(500);
        if (is_htmx_request(req.raw)) {
          throw error;
        }

        return match(config)
          .with({ NODE_ENV: "development" }, async () => {
            const youch = new Youch();
            const youchHTML = await youch.toHTML(error, {
              request: {
                url: req.raw.url,
                method: req.raw.method,
                headers: Object.fromEntries(req.raw.headers as any),
              },
            });
            const liveReloadScript = `<script defer type="module" src="${config.PUBLIC_ASSETS_PATH}/routes/___dev___/live-reload.client.js"></script>`;
            return html(
              youchHTML.replace("</body>", `${liveReloadScript}</body>`),
            );
          })
          .otherwise(async () => {
            return render(<Error_Page error={error} />);
          });
      })
  );
}

//

export function Error_Page({ error }: { error: Error }) {
  const {
    env: { PUBLIC_ASSETS_PATH },
  } = useRequestContext<AppContext>();
  const img_404 = `${PUBLIC_ASSETS_PATH}/404.svg`;
  return (
    <main class="flex h-full grow flex-col items-center justify-center">
      <div class="card-container not-found-error">
        <img src={img_404} alt="" />
        <h3>Oups, une erreur s'est produite.</h3>
        <pre>{error.message}</pre>
        <a href="/" class={button()}>
          {" "}
          Retour à l’accueil{" "}
        </a>
      </div>
    </main>
  );
}
