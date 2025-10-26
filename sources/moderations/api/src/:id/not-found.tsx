//

import config from "@~/app.core/config";
import { urls } from "@~/app.urls";

//

export function ModerationNotFound({
  moderation_id,
}: {
  moderation_id?: number | undefined;
}) {
  return (
    <main class="flex h-full grow flex-col items-center justify-center bg-(--blue-france-975-75) ">
      <div class="fr-container grid h-full grid-cols-2 items-center gap-6">
        <section>
          <h1>
            Modération <em>{moderation_id}</em> non trouvée
          </h1>
          <p class="fr-text--sm fr-mb-3w">Erreur 404</p>{" "}
          <p class="fr-text--lead fr-mb-3w">
            La modération que vous cherchez est introuvable.
            <br />
            Excusez-nous pour la gène occasionnée.
          </p>
          <a href={urls.moderations.$url().pathname} class="fr-btn">
            Retour aux modérations
          </a>
        </section>
        <figure>
          <img src={`${config.PUBLIC_ASSETS_PATH}/404.svg`} alt="" />
        </figure>
      </div>
    </main>
  );
}
