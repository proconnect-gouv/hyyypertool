//

import { hyper_ref } from "#src/html";
import { hx_include, hx_trigger_from_body } from "#src/htmx";
import { ORGANISATION_EVENTS } from "#src/lib/organizations";
import { FrNumberConverter } from "#src/ui/number";
import { formattedPlural } from "#src/ui/plurial";
import { hx_urls } from "#src/urls";
import { Fiche } from "./Fiche";
import type { get_organization_by_id } from "./get_organization_by_id.query";

//

type Organisation = Awaited<ReturnType<typeof get_organization_by_id>>;

//

export default async function Page({
  banaticUrl,
  organization,
  domains_count,
  members_count,
}: {
  banaticUrl: string;
  organization: Organisation;
  domains_count: number;
  members_count: number;
}) {
  const $domains_describedby = hyper_ref();

  const hx_get_domains_query_props = hx_urls.organizations[":id"].domains.$get({
    param: { id: organization.id },
    query: { describedby: $domains_describedby },
  });

  return (
    <main>
      <div class="bg-(--background-alt-blue-france) py-6">
        <div class="fr-container py-6">
          <h1>🏛 A propos de l'organisation</h1>

          <Fiche organization={organization} banaticUrl={banaticUrl} />
        </div>
      </div>
      <hr />
      <div class="fr-container">
        <h3 id={$domains_describedby}>
          🌐 {FrNumberConverter.format(domains_count)}{" "}
          {formattedPlural(domains_count, {
            one: "domaine",
            other: "domaines",
          })}{" "}
          connu dans l'organisation
        </h3>
        <div
          {...hx_get_domains_query_props}
          hx-trigger={[
            "load",
            ...hx_trigger_from_body([ORGANISATION_EVENTS.enum.DOMAIN_UPDATED]),
          ]}
        ></div>
        <hr />
        <br />
        <MembersInTheOrganization
          organization={organization}
          members_count={members_count}
        />
      </div>
    </main>
  );
}

async function MembersInTheOrganization({
  organization,
  members_count,
}: {
  organization: Organisation;
  members_count: number;
}) {
  const $describedby = hyper_ref();
  const $members_describedby = hyper_ref();
  const $page_ref = hyper_ref();

  const hx_get_members_query_props = hx_urls.organizations[":id"].members.$get({
    param: { id: organization.id },
    query: { describedby: $members_describedby, page_ref: $page_ref },
  });

  return (
    <section>
      <details open={false}>
        <summary>
          <h3 class="inline-block" id={$describedby}>
            👥 {FrNumberConverter.format(members_count)}{" "}
            {formattedPlural(members_count, {
              one: "membre enregistré",
              other: "membres enregistrés ",
            })}{" "}
            dans l’organisation :
          </h3>
        </summary>

        <div
          {...hx_get_members_query_props}
          class="fr-table"
          hx-include={hx_include([$page_ref])}
          hx-target="this"
          hx-trigger={[
            "load",
            ...hx_trigger_from_body([ORGANISATION_EVENTS.enum.MEMBERS_UPDATED]),
          ]}
        ></div>
      </details>
    </section>
  );
}
