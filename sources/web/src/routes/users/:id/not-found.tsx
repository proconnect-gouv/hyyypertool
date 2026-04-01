//

import type { AppEnvContext } from "#src/config";
import { button } from "#src/ui/button";
import { urls } from "#src/urls";
import { useRequestContext } from "hono/jsx-renderer";

//

export function UserNotFound({ user_id }: { user_id?: number | undefined }) {
  const { env } = useRequestContext<AppEnvContext>();
  return (
    <main class="bg-blue-france-975 flex h-full grow flex-col items-center justify-center ">
      <div class="container mx-auto grid h-full grid-cols-2 items-center gap-6 px-4">
        <section>
          <h1>
            Utilisateur <em>{user_id}</em> non trouvé
          </h1>
          <p class="mb-6 text-sm">Erreur 404</p>{" "}
          <p class="mb-6 text-lg">
            L'utilisateur que vous cherchez est introuvable.
            <br />
            Excusez-nous pour la gène occasionnée.
          </p>
          <a href={urls.users.$url().pathname} class={button()}>
            Retour aux utilisateurs
          </a>
        </section>
        <figure>
          <img src={`${env.PUBLIC_ASSETS_PATH}/404.svg`} alt="" />
        </figure>
      </div>
    </main>
  );
}
