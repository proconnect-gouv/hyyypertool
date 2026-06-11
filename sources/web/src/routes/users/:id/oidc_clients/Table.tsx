//

import { hx_include } from "#src/htmx";
import type { Pagination } from "#src/schema";
import { Foot } from "#src/ui/hx_table";
import { table } from "#src/ui/table";
import { LocalTime } from "#src/ui/time";
import { urls } from "#src/urls";
import type { get_oidc_clients_by_user_id } from "./get_oidc_clients_by_user_id.query";

//

type ConnectionsCollection = Awaited<
  ReturnType<typeof get_oidc_clients_by_user_id>
>;
type Connection = ConnectionsCollection["connections"][number];

export function Table({
  connections_collection,
  describedby,
  page_ref,
  pagination,
  user_id,
}: {
  connections_collection: ConnectionsCollection;
  describedby: string;
  page_ref: string;
  pagination: Pagination;
  user_id: number;
}) {
  const { connections, count } = connections_collection;

  const hx_get_oidc_clients_query_props = {
    ...urls.users[":id"].oidc_clients.$hx_get({
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
          <th>Date</th>
          <th>Service</th>
          <th>Organisation</th>
          <th>SP Name</th>
        </tr>
      </thead>
      <tbody>
        {connections.map((connection) => (
          <Row key={`${connection.id}`} connection={connection} />
        ))}
      </tbody>

      <Foot
        colspan={4}
        count={count}
        hx_query_props={hx_get_oidc_clients_query_props}
        id={page_ref}
        pagination={pagination}
      />
    </table>
  );
}

//

function Row({ connection, key }: { connection: Connection; key?: string }) {
  const org = connection.organization;
  const org_href = org
    ? urls.organizations[":id"].$url({ param: { id: org.id } }).pathname
    : null;

  return (
    <tr class="dark:hover:bg-grey-850 hover:bg-gray-100" key={key}>
      <td>
        <LocalTime date={connection.created_at} />
      </td>
      <td>
        <span title={connection.oidc_client.client_id}>
          {connection.oidc_client.client_name}
        </span>
      </td>
      <td>
        {org && org_href ? (
          <a href={org_href}>{org.cached_libelle ?? org.siret}</a>
        ) : (
          <span>—</span>
        )}
      </td>
      <td>{connection.sp_name ?? <span>—</span>}</td>
    </tr>
  );
}
