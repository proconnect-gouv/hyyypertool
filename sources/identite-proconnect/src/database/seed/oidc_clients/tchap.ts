import type { IdentiteProconnectPgDatabase } from "../..";
import { schema } from "../..";

export async function insert_tchap(db: IdentiteProconnectPgDatabase) {
  const insert = await db
    .insert(schema.oidc_clients)
    .values({
      client_id: "tchap",
      client_name: "Tchap",
      client_secret: "seed-secret-tchap",
    })
    .returning();

  return insert.at(0)!;
}
