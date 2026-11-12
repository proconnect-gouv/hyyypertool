//

import { hyper_ref } from "#src/html";
import { hx_trigger_from_body } from "#src/htmx";
import { ORGANISATION_EVENTS } from "#src/lib/organizations";
import { alert } from "#src/ui/notice";
import { fr_number_converter } from "#src/ui/number";
import { hx_get_members_table_props } from "#src/ui/organizations/members";
import { formattedPlural } from "#src/ui/plurial";
import { urls } from "#src/urls";
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
  status,
}: {
  banaticUrl: string;
  organization: Organisation;
  domains_count: number;
  members_count: number;
  status?: "created";
}) {
  const $domains_describedby = hyper_ref();

  const hx_get_domains_query_props = urls.organizations[":id"].domains.$hx_get({
    param: { id: organization.id },
    query: { describedby: $domains_describedby },
  });
  const hx_get_domain_history_props = urls.organizations[
    ":id"
  ].domains.history.$hx_get({ param: { id: organization.id } });

  const { base: alert_base } = alert({ intent: "success" });

  return (
    <main>
      <div class="bg-surface py-6">
        <div class="container mx-auto px-4 py-6">
          <h1>🏛 A propos de l'organisation</h1>

          {status === "created" && (
            <div class={alert_base()} role="alert">
              <p class="mb-0">Organisation créée !</p>
            </div>
          )}

          <Fiche organization={organization} banaticUrl={banaticUrl} />
        </div>
      </div>
      <hr class="border-none py-3" />
      <div class="container mx-auto p-3">
        <h3 id={$domains_describedby}>
          🌐 {fr_number_converter.format(domains_count)}{" "}
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
        <details>
          <summary>🕓 Historique des domaines</summary>
          <div
            {...hx_get_domain_history_props}
            hx-target="this"
            hx-trigger={[
              "load",
              ...hx_trigger_from_body([
                ORGANISATION_EVENTS.enum.DOMAIN_UPDATED,
              ]),
            ]}
          ></div>
        </details>
        <hr class="border-none py-3" />
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
  return (
    <section>
      <details open={false}>
        <summary>
          <h3 class="inline-block">
            👥 {fr_number_converter.format(members_count)}{" "}
            {formattedPlural(members_count, {
              one: "membre enregistré",
              other: "membres enregistrés ",
            })}{" "}
            dans l’organisation :
          </h3>
        </summary>

        <a
          href={
            urls.organizations[":id"].members.$url({
              param: { id: organization.id },
            }).pathname
          }
        >
          Voir tous les membres →
        </a>
        <div
          {...hx_get_members_table_props(organization.id)}
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
