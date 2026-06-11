import type { IdentiteProconnectPgDatabase } from "../..";
import { schema } from "../..";

export async function insert_resana(db: IdentiteProconnectPgDatabase) {
  const insert = await db
    .insert(schema.oidc_clients)
    .values({
      client_id: "resana",
      client_name: "Resana",
      client_secret: "seed-secret-resana",
    })
    .returning();

  return insert.at(0)!;
}
