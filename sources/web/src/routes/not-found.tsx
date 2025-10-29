//

import type { AppEnv_Context } from "#src/config";
import type { App_Context } from "#src/middleware/context";
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
    <main class="bg-(--blue-france-975-75) flex min-h-full flex-1 items-center">
      <div class="fr-container grid h-full grid-cols-2 items-center justify-items-center gap-6">
        <section>
          <h1>Oups, nous n'avons pas trouvé la page que vous recherchez.</h1>
          <p class="fr-text--sm fr-mb-3w">Erreur 404</p>

          <p class="fr-text--lead fr-mb-3w">
            La page que vous cherchez est introuvable.
            <br />
            Excusez-nous pour la gène occasionnée.
          </p>
          <a href="/" class="fr-btn">
            {" "}
            Retour à l’accueil{" "}
          </a>
        </section>
        <figure>
          <img src={`${config.PUBLIC_ASSETS_PATH}/404.svg`} alt="" />
        </figure>
      </div>
    </main>
  );
}
