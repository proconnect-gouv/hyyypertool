//

import type { AppEnvContext } from "#src/config";
import type { AppContext } from "#src/middleware/context";
import { button } from "#src/ui/button";
import type { Context } from "hono";
import { useRequestContext } from "hono/jsx-renderer";

export function not_found_handler(c: Context) {
  const { render, status } = c as Context<AppContext>;
  status(404);
  return render(<NotFound />);
}

//

export function NotFound() {
  const {
    env: { PUBLIC_ASSETS_PATH },
  } = useRequestContext<AppEnvContext>();

  return (
    <main class="bg-blue-france-975 flex min-h-full flex-1 items-center">
      <div class="container mx-auto grid h-full grid-cols-2 items-center justify-items-center gap-6 px-4">
        <section>
          <h1>Oups, nous n'avons pas trouvé la page que vous recherchez.</h1>
          <p class="mb-6 text-sm">Erreur 404</p>

          <p class="mb-6 text-lg">
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
          <img src={`${PUBLIC_ASSETS_PATH}/404.svg`} alt="" />
        </figure>
      </div>
    </main>
  );
}
