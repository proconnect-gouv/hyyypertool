//

import { hyper_ref } from "#src/html";
import { hx_include, hx_trigger_from_body } from "#src/htmx";
import { ORGANISATION_EVENTS } from "#src/lib/organizations";
import { FrNumberConverter } from "#src/ui/number";
import { formattedPlural } from "#src/ui/plurial";
import { hx_urls } from "#src/urls";
import { usePageRequestContext } from "./context";
import { Fiche } from "./Fiche";

//

export default async function Page() {
  const {
    var: { organization, query_organization_domains_count },
  } = usePageRequestContext();
  const $domains_describedby = hyper_ref();

  const hx_get_domains_query_props = await hx_urls.organizations[
    ":id"
  ].domains.$get({
    param: { id: organization.id.toString() },
    query: { describedby: $domains_describedby },
  });

  const count = await query_organization_domains_count;

  return (
    <main>
      <div class="bg-(--background-alt-blue-france) py-6">
        <div class="fr-container py-6">
          <h1>🏛 A propos de l'organisation</h1>

          <Fiche />
        </div>
      </div>
      <hr />
      <div class="fr-container">
        <h3 id={$domains_describedby}>
          🌐 {FrNumberConverter.format(count)}{" "}
          {formattedPlural(count, {
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
        <MembersInTheOrganization />
      </div>
    </main>
  );
}

async function MembersInTheOrganization() {
  const $describedby = hyper_ref();
  const $members_describedby = hyper_ref();
  const $page_ref = hyper_ref();
  const {
    var: { organization, query_organization_members_count },
  } = usePageRequestContext();
  const count = await query_organization_members_count;

  const hx_get_members_query_props = await hx_urls.organizations[
    ":id"
  ].members.$get({
    param: { id: organization.id.toString() },
    query: { describedby: $members_describedby, page_ref: $page_ref },
  });

  return (
    <section>
      <details open={false}>
        <summary>
          <h3 class="inline-block" id={$describedby}>
            👥 {FrNumberConverter.format(count)}{" "}
            {formattedPlural(count, {
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
