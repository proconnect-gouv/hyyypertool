//

import type { AppEnvContext } from "#src/config";
import { button } from "#src/ui/button";
import { urls } from "#src/urls";
import { useRequestContext } from "hono/jsx-renderer";

//

export function OrganizationNotFound({
  organization_id,
}: {
  organization_id?: number | undefined;
}) {
  const { env } = useRequestContext<AppEnvContext>();
  return (
    <main class="bg-blue-france-975 flex h-full grow flex-col items-center justify-center ">
      <div class="container mx-auto grid h-full grid-cols-2 items-center gap-6 px-4">
        <section>
          <h1>
            Organization <em>{organization_id}</em> non trouvé
          </h1>
          <p class="mb-6 text-sm">Erreur 404</p>{" "}
          <p class="mb-6 text-lg">
            L'organization que vous cherchez est introuvable.
            <br />
            Excusez-nous pour la gène occasionnée.
          </p>
          <a href={urls.organizations.$url().pathname} class={button()}>
            Retour aux organisations
          </a>
        </section>
        <figure>
          <img src={`${env.PUBLIC_ASSETS_PATH}/404.svg`} alt="" />
        </figure>
      </div>
    </main>
  );
}
