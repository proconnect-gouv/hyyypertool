//

import type { AppEnv_Context } from "#src/config";
import type { App_Context } from "#src/middleware/context";
import { button } from "#src/ui/button";
import type { Context } from "hono";
import { useRequestContext } from "hono/jsx-renderer";

export function not_found_handler(c: Context) {
  const { render, status } = c as Context<App_Context>;
  status(404);
  return render(<NotFound />);
}

//

export function NotFound() {
  const {
    var: { config },
  } = useRequestContext<AppEnv_Context>();

  return (
    <main class="flex min-h-full flex-1 items-center bg-(--blue-france-975-75)">
      <div class="max-w-7xl mx-auto px-4 grid h-full grid-cols-2 items-center justify-items-center gap-6">
        <section>
          <h1>Oups, nous n'avons pas trouvé la page que vous recherchez.</h1>
          <p class="text-sm mb-6">Erreur 404</p>

          <p class="text-lg mb-6">
            La page que vous cherchez est introuvable.
            <br />
            Excusez-nous pour la gène occasionnée.
          </p>
          <a href="/" class={button()}>
            {" "}
            Retour à l'accueil{" "}
          </a>
        </section>
        <figure>
          <img src={`${config.PUBLIC_ASSETS_PATH}/404.svg`} alt="" />
        </figure>
      </div>
    </main>
  );
}
