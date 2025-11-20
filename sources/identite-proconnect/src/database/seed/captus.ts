//

import { EMAIL_DOMAIN_APPROVED_VERIFICATION_TYPES } from "#src/types";
import { schema, type IdentiteProconnect_PgDatabase } from "..";

//

export async function create_cactus_organization(
  pg: IdentiteProconnect_PgDatabase,
) {
  const [{ id: organization_id }] = await pg
    .insert(schema.organizations)
    .values({
      cached_libelle: "🌵 libelle",
      siret: "🌵 siret",
    })
    .returning({ id: schema.organizations.id });

  await pg.insert(schema.email_domains).values({
    domain: "cactus.corn",
    organization_id,
    verification_type: EMAIL_DOMAIN_APPROVED_VERIFICATION_TYPES.enum.verified,
  });

  return organization_id;
}
