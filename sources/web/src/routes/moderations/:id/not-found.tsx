//

import config from "#src/config";
import { button } from "#src/ui/button";
import { urls } from "#src/urls";

//

export function ModerationNotFound({
  moderation_id,
}: {
  moderation_id?: number | undefined;
}) {
  return (
    <main class="flex h-full grow flex-col items-center justify-center bg-blue-france-975-75 ">
      <div class="max-w-7xl mx-auto px-4 grid h-full grid-cols-2 items-center gap-6">
        <section>
          <h1>
            Modération <em>{moderation_id}</em> non trouvée
          </h1>
          <p class="text-sm mb-6">Erreur 404</p>{" "}
          <p class="text-lg mb-6">
            La modération que vous cherchez est introuvable.
            <br />
            Excusez-nous pour la gène occasionnée.
          </p>
          <a href={urls.moderations.$url().pathname} class={button()}>
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
