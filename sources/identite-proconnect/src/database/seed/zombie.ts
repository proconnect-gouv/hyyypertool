//

import { schema, type IdentiteProconnectPgDatabase } from "..";

//

export async function create_zombie_organization(
  pg: IdentiteProconnectPgDatabase,
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
