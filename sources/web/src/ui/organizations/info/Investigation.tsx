import { button } from "#src/ui/button";
import { urls } from "#src/urls";

import type { JSX } from "hono/jsx";

type Props = JSX.IntrinsicElements["section"] & {
  banaticUrl: string;
  organization: { cached_code_postal: string | null; siret: string };
};

const EHPAD_URL =
  "https://www.pour-les-personnes-agees.gouv.fr/annuaire-ehpad-et-comparateur-de-prix-et-restes-a-charge";

export async function Investigation(props: Props) {
  const { banaticUrl, organization } = props;

  const hx_organizations_leaders_props = urls.organizations.leaders.$hx_get({
    query: { siret: organization.siret },
  });

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
          href={`https://lannuaire.service-public.fr/recherche?whoWhat=&where=${organization.cached_code_postal}`}
          class={button_classes}
          rel="noopener noreferrer"
          target="_blank"
        >
          Chercher les services publics associés
        </a>
      </li>

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

      <li>
        <a
          href={EHPAD_URL}
          class={button_classes}
          rel="noopener noreferrer"
          target="_blank"
        >
          Chercher via EHPAD
        </a>
      </li>

      <li>
        <a class="" {...hx_organizations_leaders_props} hx-trigger="load">
          <i class="text-center">Recherche des dirigeants...</i>
        </a>
      </li>
    </ul>
  );
}
