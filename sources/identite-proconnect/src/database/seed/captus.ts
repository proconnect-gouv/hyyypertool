//

import { EMAIL_DOMAIN_APPROVED_VERIFICATION_TYPES } from "#src/types";
import { schema, type IdentiteProconnectPgDatabase } from "..";

//

export async function create_cactus_organization(
  pg: IdentiteProconnectPgDatabase,
) {
  const [{ id: organization_id } = { id: NaN }] = await pg
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
