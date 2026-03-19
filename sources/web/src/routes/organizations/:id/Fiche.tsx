//

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
    <section class="grid grid-cols-3 gap-4">
      <div class="border-grey-200 col-span-2 border bg-white p-6 shadow-sm">
        <h1 class="text-blue-france">« {organization.cached_libelle} »</h1>
        <About organization={organization} />
      </div>
      <div class="border-grey-200 border bg-white p-6 shadow-sm">
        <Investigation banaticUrl={banaticUrl} organization={organization} />
      </div>
    </section>
  );
}
