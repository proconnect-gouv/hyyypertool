import type { IdentiteProconnectPgDatabase } from "../..";
import { schema } from "../..";

export async function insert_jean_bon_oidc_connections(
  db: IdentiteProconnectPgDatabase,
  {
    tchap_id,
    resana_id,
    dinum_id,
    user_id,
  }: {
    tchap_id: number;
    resana_id: number;
    dinum_id: number;
    user_id: number;
  },
) {
  return db.insert(schema.users_oidc_clients).values([
    {
      created_at: "2022-03-10T08:45:00+01:00",
      oidc_client_id: tchap_id,
      organization_id: dinum_id,
      sp_name: "Tchap",
      updated_at: "2022-03-10T08:45:00+01:00",
      user_ip_address: "172.16.0.5",
      user_id,
    },
    {
      created_at: "2023-11-20T16:00:00+01:00",
      oidc_client_id: resana_id,
      organization_id: dinum_id,
      sp_name: "Resana",
      updated_at: "2023-11-20T16:00:00+01:00",
      user_id,
    },
  ]);
}
