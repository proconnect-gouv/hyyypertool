//

import type { IdentiteProconnectPgDatabase } from "../..";
import { schema } from "../..";

//

export async function insert_jeanyeshack(db: IdentiteProconnectPgDatabase) {
  const insert = await db
    .insert(schema.users)
    .values({
      created_at: "2024-01-15T11:30:00.000+02:00",
      email: "jean@yeswehack.com",
      family_name: "Dupont",
      given_name: "Jean",
      updated_at: "2024-01-15T11:30:00.000+02:00",
    })
    .returning();

  return insert.at(0)!;
}
