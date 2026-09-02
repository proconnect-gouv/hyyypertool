//

import { alert } from "#src/ui/notice";
import { ApiEntrepriseConnectionError } from "@proconnect-gouv/proconnect.api_entreprise/types";
import {
  InvalidSiretError,
  NotFoundError,
} from "@proconnect-gouv/proconnect.identite/errors";
import { match, P } from "ts-pattern";

//

export function OrganizationInfoErrorAlert({ error }: { error: Error }) {
  const { base, title } = alert({ intent: "error" });

  const message = match(error)
    .with(
      P.instanceOf(InvalidSiretError),
      () => "Ce SIRET n'est pas valide. Il doit contenir 14 chiffres.",
    )
    .with(
      P.instanceOf(NotFoundError),
      () =>
        "Aucune organisation n'a été trouvée pour ce SIRET (ou elle n'est pas diffusible).",
    )
    .with(
      P.instanceOf(ApiEntrepriseConnectionError),
      () =>
        "Le service entreprise.api.gouv.fr est indisponible. Réessayez dans quelques instants.",
    )
    .otherwise(() => "Une erreur inattendue est survenue.");

  return (
    <div class={base()} role="alert">
      <p class={title()}>Organisation introuvable</p>
      <p class="mb-0">{message}</p>
    </div>
  );
}
