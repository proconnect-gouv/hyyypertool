//

import { date_to_dom_string } from "#src/time";
import { hx_include } from "@~/app.core/htmx";
import { Foot } from "@~/app.ui/hx_table";
import { notice } from "@~/app.ui/notice";
import { Time } from "@~/app.ui/time";
import { hx_urls, urls } from "@~/app.urls";
import type { GetOrganizationsByUserIdDto } from "@~/organizations.repository";
import { usePageRequestContext } from "./context";

//

export async function Table() {
  const {
    req,
    var: { pagination, query_organizations_collection },
  } = usePageRequestContext();
  const { id: user_id } = req.valid("param");
  const { describedby, page_ref } = req.valid("query");

  const { organizations, count } = await query_organizations_collection;

  const hx_get_organizations_query_props = {
    ...(await hx_urls.users[":id"].organizations.$get({
      param: {
        id: user_id.toString(),
      },
      query: { describedby, page_ref },
    })),
    "hx-include": hx_include([page_ref]),
  };

  return (
    <div class="fr-table *:table!">
      <table aria-describedby={describedby}>
        <thead>
          <tr>
            <th>Date de création</th>
            <th class="break-words">Siret</th>
            <th class="break-words">Libellé</th>
            <th class="break-words">Domains</th>
            <th class="max-w-32 break-words">Code géographique officiel</th>

            <th></th>
          </tr>
        </thead>

        <tbody>
          {organizations.map((organization) => (
            <Row key={organization.id.toString()} organization={organization} />
          ))}
        </tbody>

        <Foot
          count={count}
          hx_query_props={hx_get_organizations_query_props}
          id={page_ref}
          pagination={pagination}
        />
      </table>
    </div>
  );
}

//

export function Row({
  key,
  organization,
}: {
  key?: string;
  organization: GetOrganizationsByUserIdDto["organizations"][number];
}) {
  const {
    cached_code_officiel_geographique,
    cached_libelle,
    created_at,
    email_domains,
    id,
    siret,
  } = organization;

  return (
    <tr aria-label={`Organisation ${cached_libelle} pour (${siret})`} key={key}>
      <td>
        <Time date={created_at}>
          {date_to_dom_string(new Date(created_at))}
        </Time>
      </td>
      <td>{siret}</td>
      <td>{cached_libelle}</td>
      <td>{email_domains.map(({ domain }) => domain).join(", ")}</td>
      <td>{cached_code_officiel_geographique}</td>
      <td class="text-right!">
        <a
          class="p-3"
          href={
            urls.organizations[":id"].$url({ param: { id: id.toString() } })
              .pathname
          }
        >
          ➡️
        </a>
      </td>
    </tr>
  );
}

export function EmptyTable() {
  const { base, container, body, title } = notice();
  return (
    <div class={base()}>
      <div class={container()}>
        <div class={body()}>
          <p class={title()}>
            🥹 Aucune organisation n'a été trouvée pour cet utilisateur.
          </p>
        </div>
      </div>
    </div>
  );
}
