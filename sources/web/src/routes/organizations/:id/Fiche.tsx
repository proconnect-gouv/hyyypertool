//

import { About, Investigation } from "#src/ui/organizations/info";
import { usePageRequestContext } from "./context";

//

export async function Fiche() {
  const {
    var: { banaticUrl, organization },
  } = usePageRequestContext();

  return (
    <section class="grid grid-cols-3 gap-4">
      <div class="fr-card p-6! col-span-2">
        <h1 class="text-(--text-action-high-blue-france)">
          « {organization.cached_libelle} »
        </h1>
        <About organization={organization} />
      </div>
      <div class="fr-card p-6!">
        <Investigation banaticUrl={banaticUrl} organization={organization} />
      </div>
    </section>
  );
}
