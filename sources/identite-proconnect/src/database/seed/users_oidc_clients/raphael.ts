import type { IdentiteProconnectPgDatabase } from "../..";
import { schema } from "../..";

export async function insert_raphael_oidc_connections(
  db: IdentiteProconnectPgDatabase,
  {
    oidc_client_id,
    organization_id,
    user_id,
  }: {
    oidc_client_id: number;
    organization_id: number;
    user_id: number;
  },
) {
  return db.insert(schema.users_oidc_clients).values([
    {
      created_at: "2023-06-01T09:12:00+02:00",
      oidc_client_id,
      organization_id,
      sp_name: "Annuaire des entreprises",
      updated_at: "2023-06-01T09:12:00+02:00",
      user_id,
    },
    {
      created_at: "2023-08-15T14:30:00+02:00",
      oidc_client_id,
      organization_id,
      sp_name: "Annuaire des entreprises",
      updated_at: "2023-08-15T14:30:00+02:00",
      user_ip_address: "192.168.1.42",
      user_id,
    },
    {
      created_at: "2024-01-10T10:05:00+01:00",
      oidc_client_id,
      organization_id: null,
      sp_name: "Annuaire des entreprises",
      updated_at: "2024-01-10T10:05:00+01:00",
      user_ip_address: "10.0.0.7",
      user_id,
    },
  ]);
}
