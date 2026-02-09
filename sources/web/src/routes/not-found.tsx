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
          <img src={`${PUBLIC_ASSETS_PATH}/404.svg`} alt="" />
        </figure>
      </div>
    </main>
  );
}
