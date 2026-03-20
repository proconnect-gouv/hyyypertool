//

import { card } from "#src/ui/card";
import { About, Investigation } from "#src/ui/organizations/info";
import type { get_organization_by_id } from "./get_organization_by_id.query";

//

type Organisation = Awaited<ReturnType<typeof get_organization_by_id>>;

export async function Fiche({
  banaticUrl,
  organization,
}: {
  banaticUrl: string;
  organization: Organisation;
}) {
  return (
    <section class="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div class={card().base({ class: "md:col-span-2" })}>
        <h1 class="text-blue-france">« {organization.cached_libelle} »</h1>
        <About organization={organization} />
      </div>
      <div class={card().base()}>
        <Investigation banaticUrl={banaticUrl} organization={organization} />
      </div>
    </section>
  );
}
