import type { IdentiteProconnectPgDatabase } from "../..";
import { schema } from "../..";

export async function insert_annuaire_entreprises(
  db: IdentiteProconnectPgDatabase,
) {
  const insert = await db
    .insert(schema.oidc_clients)
    .values({
      client_id: "annuaire-entreprises",
      client_name: "Annuaire des entreprises",
      client_secret: "seed-secret-annuaire-entreprises",
    })
    .returning();

  return insert.at(0)!;
}
