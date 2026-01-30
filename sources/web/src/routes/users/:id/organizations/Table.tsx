//

import { hx_include } from "#src/htmx";
import { date_to_dom_string } from "#src/time";
import { Foot } from "#src/ui/hx_table";
import { notice } from "#src/ui/notice";
import { Time } from "#src/ui/time";
import { hx_urls } from "#src/urls";
import type { Pagination } from "@~/core/schema";
import type { get_organizations_by_user_id } from "./get_organizations_by_user_id.query";

//

type OrganizationsCollection = Awaited<
  ReturnType<typeof get_organizations_by_user_id>
>;
type Organization = OrganizationsCollection["organizations"][number];

export async function Table({
  pagination,
  organizations_collection,
  user_id,
  describedby,
  page_ref,
}: {
  pagination: Pagination;
  organizations_collection: OrganizationsCollection;
  user_id: number;
  describedby: string;
  page_ref: string;
}) {
  const { organizations, count } = organizations_collection;

  const hx_get_organizations_query_props = {
    ...(await hx_urls.users[":id"].organizations.$get({
      param: {
        id: user_id,
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
  organization: Organization;
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
            hx_urls.organizations[":id"].$url({ param: { id: id } }).pathname
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
