//

import config from "#src/config";
import { NotFoundError } from "#src/errors";
import type { App_Context } from "#src/middleware/context";
import { button } from "#src/ui/button";
import consola from "consola";
import { type Context } from "hono";
import { useRequestContext } from "hono/jsx-renderer";
import { P, match } from "ts-pattern";
import Youch from "youch";

//

export function error_handler(error: Error, c: Context) {
  const {
    html,
    notFound,
    render,
    req,
    status,
    var: { sentry },
  } = c as Context<App_Context>;

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
        return match(config)
          .with({ NODE_ENV: "development" }, async () => {
            const youch = new Youch(error, req.raw);
            return html(await youch.toHTML());
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
    var: { config },
  } = useRequestContext<App_Context>();

  return (
    <main class="flex h-full grow flex-col items-center justify-center">
      <div class="card-container not-found-error">
        <img src={`${config.PUBLIC_ASSETS_PATH}/404.svg`} alt="" />
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
