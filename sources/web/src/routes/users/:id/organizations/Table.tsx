//

import { hx_include } from "#src/htmx";
import type { Pagination } from "#src/schema";
import { date_to_dom_string } from "#src/time";
import { Foot } from "#src/ui/hx_table";
import { MemberRowActions } from "#src/ui/member-row-actions";
import { notice } from "#src/ui/notice";
import { table } from "#src/ui/table";
import { Time } from "#src/ui/time";
import { urls } from "#src/urls";
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
  is_editor = true,
}: {
  pagination: Pagination;
  organizations_collection: OrganizationsCollection;
  user_id: number;
  describedby: string;
  page_ref: string;
  is_editor?: boolean;
}) {
  const { organizations, count } = organizations_collection;

  const hx_get_organizations_query_props = {
    ...urls.users[":id"].organizations.$hx_get({
      param: {
        id: user_id,
      },
      query: { describedby, page_ref },
    }),
    "hx-include": hx_include([page_ref]),
  };

  return (
    <table class={table()} aria-describedby={describedby}>
      <thead>
        <tr>
          <th>Date de création</th>
          <th class="warp-break-word">Siret</th>
          <th class="warp-break-word">Libellé</th>
          <th class="warp-break-word">Domains</th>
          <th class="warp-break-word">Type de vérification</th>
          <th class="warp-break-word">Interne</th>
          <th class="max-w-32 break-words">Code géographique officiel</th>

          <th></th>
        </tr>
      </thead>

      <tbody>
        {organizations.map((organization) => (
          <Row
            key={organization.id.toString()}
            is_editor={is_editor}
            organization={organization}
            user_id={user_id}
          />
        ))}
      </tbody>

      <Foot
        count={count}
        hx_query_props={hx_get_organizations_query_props}
        id={page_ref}
        pagination={pagination}
      />
    </table>
  );
}

//

export function Row({
  key,
  is_editor = true,
  organization,
  user_id,
}: {
  key?: string;
  is_editor?: boolean;
  organization: Organization;
  user_id: number;
}) {
  const {
    cached_code_officiel_geographique,
    cached_libelle,
    created_at,
    email_domains,
    id,
    is_external,
    siret,
    verification_type,
  } = organization;

  const href = urls.organizations[":id"].$url({ param: { id: id } }).pathname;

  return (
    <tr
      aria-label={`Organisation ${cached_libelle} pour (${siret})`}
      class="dark:hover:bg-grey-850 relative focus-within:outline-2 focus-within:outline-blue-500 hover:bg-gray-100"
      key={key}
    >
      <td>
        <Time date={created_at}>
          {date_to_dom_string(new Date(created_at))}
        </Time>
      </td>
      <td>{siret}</td>
      <td>{cached_libelle}</td>
      <td>{email_domains.map(({ domain }) => domain).join(", ")}</td>
      <td>{verification_type}</td>
      <td>{is_external ? "❌" : "✅"}</td>
      <td>
        <a
          class="after:absolute after:inset-0 after:content-[''] focus:outline-none"
          href={href}
          aria-label={`Organisation ${cached_libelle} pour (${siret})`}
        >
          {cached_code_officiel_geographique}
        </a>
      </td>
      <td class="space-x-2 text-end">
        {is_editor && (
          <MemberRowActions
            user_id={user_id}
            organization_id={id}
            is_external={organization.is_external}
            verification_type={organization.verification_type}
            open_href={href}
          />
        )}
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
