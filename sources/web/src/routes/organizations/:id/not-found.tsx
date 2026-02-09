//

import config from "#src/config";
import { button } from "#src/ui/button";
import { urls } from "#src/urls";

//

export function Organization_NotFound({
  organization_id,
}: {
  organization_id?: number | undefined;
}) {
  return (
    <main class="flex h-full grow flex-col items-center justify-center bg-blue-france-975-75 ">
      <div class="max-w-7xl mx-auto px-4 grid h-full grid-cols-2 items-center gap-6">
        <section>
          <h1>
            Organization <em>{organization_id}</em> non trouvé
          </h1>
          <p class="text-sm mb-6">Erreur 404</p>{" "}
          <p class="text-lg mb-6">
            L'organization que vous cherchez est introuvable.
            <br />
            Excusez-nous pour la gène occasionnée.
          </p>
          <a href={urls.organizations.$url().pathname} class={button()}>
            Retour aux organisations
          </a>
        </section>
        <figure>
          <img src={`${config.PUBLIC_ASSETS_PATH}/404.svg`} alt="" />
        </figure>
      </div>
    </main>
  );
}
