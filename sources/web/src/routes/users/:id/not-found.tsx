//

import config from "#src/config";
import { hx_urls } from "#src/urls";

//

export function UserNotFound({ user_id }: { user_id?: number | undefined }) {
  return (
    <main class="flex h-full grow flex-col items-center justify-center bg-(--blue-france-975-75) ">
      <div class="fr-container grid h-full grid-cols-2 items-center gap-6">
        <section>
          <h1>
            Utilisateur <em>{user_id}</em> non trouvé
          </h1>
          <p class="fr-text--sm fr-mb-3w">Erreur 404</p>{" "}
          <p class="fr-text--lead fr-mb-3w">
            L'utilisateur que vous cherchez est introuvable.
            <br />
            Excusez-nous pour la gène occasionnée.
          </p>
          <a href={hx_urls.users.$url().pathname} class="fr-btn">
            Retour aux utilisateurs
          </a>
        </section>
        <figure>
          <img src={`${config.PUBLIC_ASSETS_PATH}/404.svg`} alt="" />
        </figure>
      </div>
    </main>
  );
}
