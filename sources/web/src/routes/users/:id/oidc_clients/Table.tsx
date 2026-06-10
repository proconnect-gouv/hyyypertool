//

import { table } from "#src/ui/table";
import { LocalTime } from "#src/ui/time";
import { urls } from "#src/urls";
import type { get_oidc_clients_by_user_id } from "./get_oidc_clients_by_user_id.query";

//

type ConnectionList = Awaited<ReturnType<typeof get_oidc_clients_by_user_id>>;

export function Table({
  connections,
  describedby,
}: {
  connections: ConnectionList;
  describedby: string;
}) {
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
    </table>
  );
}

//

function Row({
  connection,
  key,
}: {
  connection: ConnectionList[number];
  key?: string;
}) {
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
