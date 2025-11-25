//

import { schema, type IdentiteProconnectPgDatabase } from "../..";

//

export async function insert_mariebon(pg: IdentiteProconnectPgDatabase) {
  const [{ id: user_id }] = await pg
    .insert(schema.users)
    .values({
      created_at: "2014-02-13T18:25:09.000+02:00",
      email_verified: true,
      email: "marie.bon@fr.bosch.com",
      family_name: "Bon",
      given_name: "Marie",
      job: "Gestionnaire données sociales",
      last_sign_in_at: "2024-02-15T13:48:00.106+02:00",
      sign_in_count: 3,
      updated_at: "2014-02-15T14:48:00.000+02:00",
    })
    .returning({ id: schema.users.id });

  return user_id;
}
