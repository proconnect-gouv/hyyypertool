//

import { schema, type IdentiteProconnect_PgDatabase } from "..";

//

export async function create_troll_organization(
  pg: IdentiteProconnect_PgDatabase,
) {
  const [{ id: organization_id }] = await pg
    .insert(schema.organizations)
    .values({
      cached_libelle: "🧌 libelle",
      siret: "🧌 siret",
    })
    .returning({ id: schema.organizations.id });

  return organization_id;
}
