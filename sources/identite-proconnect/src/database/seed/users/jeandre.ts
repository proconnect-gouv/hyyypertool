//

import type { IdentiteProconnect_PgDatabase } from "../..";
import { schema } from "../..";

//

export async function insert_jeandre(db: IdentiteProconnect_PgDatabase) {
  const insert = await db
    .insert(schema.users)
    .values({
      created_at: "2024-01-15T11:30:00.000+02:00",
      email: "jeandre@yopmail.com",
      family_name: "Dré",
      given_name: "Jean",
      updated_at: "2024-01-15T11:30:00.000+02:00",
    })
    .returning();

  return insert.at(0)!;
}
