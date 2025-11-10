//

import { schema, type IdentiteProconnect_PgDatabase } from "..";

//

export async function create_zombie_organization(
  pg: IdentiteProconnect_PgDatabase,
) {
  const [{ id: organization_id }] = await pg
    .insert(schema.organizations)
    .values({
      cached_libelle: "🧟‍♂️ libelle",
      siret: "🧟‍♂️ siret",
      cached_est_active: false,
    })
    .returning({ id: schema.organizations.id });

  await pg.insert(schema.email_domains).values({
    domain: "zombie.corn",
    organization_id,
    verification_type: null,
  });

  return organization_id;
}
