//

import { button } from "@~/app.ui/button";
import { hx_urls } from "@~/app.urls";

import type { Organization } from "@~/organizations.lib/entities/Organization";
import type { JSX } from "hono/jsx";

//

type Props = JSX.IntrinsicElements["section"] & {
  organization: Pick<Organization, "cached_code_postal" | "siret">;
};

//

export async function Investigation(props: Props) {
  const { organization } = props;
  const hx_organizations_leaders_props =
    await hx_urls.organizations.leaders.$get({
      query: { siret: organization.siret },
    });
  const siren = organization.siret.substring(0, 9);
  const banaticUrl = `https://www.banatic.interieur.gouv.fr/intercommunalite/${siren}`;
  let isBanaticAvailable = false;
  try {
    const response = await fetch(banaticUrl, {
      method: "HEAD",
      signal: AbortSignal.timeout(3000),
    });
    isBanaticAvailable = response.ok;
    // oxlint-disable-next-line no-unused-vars
  } catch (error) {
    isBanaticAvailable = false;
  }
  const button_classes = button({
    class: "mr-2 bg-white",
    size: "sm",
    type: "tertiary",
  });

  return (
    <ul class="mt-5 w-full list-none bg-[#F6F6F6] p-3 [&_li]:inline-block">
      <li>
        <a
          href={`https://lannuaire.service-public.fr/recherche?where=${organization.cached_code_postal}&whoWhat=Mairie`}
          class={button_classes}
          rel="noopener noreferrer"
          target="_blank"
        >
          Chercher la mairie associée
        </a>
      </li>
      <li>
        <a
          href={`https://lannuaire.service-public.fr/recherche?where=${organization.cached_code_postal}`}
          class={button_classes}
          rel="noopener noreferrer"
          target="_blank"
        >
          Chercher les services publics associés
        </a>
      </li>
      {isBanaticAvailable && (
        <li>
          <a
            href={banaticUrl}
            class={button_classes}
            rel="noopener noreferrer"
            target="_blank"
          >
            Chercher via Banatic
          </a>
        </li>
      )}
      <li>
        <a class="" {...hx_organizations_leaders_props} hx-trigger="load">
          <i class="text-center">Recherche des dirigeants...</i>
        </a>
      </li>
    </ul>
  );
}
