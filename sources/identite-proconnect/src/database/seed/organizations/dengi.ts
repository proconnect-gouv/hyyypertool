import { EMAIL_DOMAIN_APPROVED_VERIFICATION_TYPES } from "#src/types";
import type { IdentiteProconnectPgDatabase } from "../..";
import { schema } from "../..";

export async function insert_dengi(db: IdentiteProconnectPgDatabase) {
  const insert = await db
    .insert(schema.organizations)
    .values({
      cached_activite_principale: "47.11F",
      cached_categorie_juridique: "SAS, société par actions simplifiée",
      cached_code_officiel_geographique: "75107",
      cached_est_active: true,
      cached_etat_administratif: "A",
      cached_libelle_tranche_effectif: "50 à 99 salariés, en 2021",
      cached_libelle: "Dengi - Leclerc",
      cached_nom_complet: "Dengi",
      cached_tranche_effectifs: "21",
      created_at: "2018-07-13T17:35:15+02:00",
      siret: "38514019900014",
      updated_at: "2023-06-22T16:34:34+02:00",
    })
    .returning();

  const organization = insert.at(0)!;
  await db.insert(schema.email_domains).values({
    domain: "scapartois.fr",
    organization_id: organization.id,
    verification_type: EMAIL_DOMAIN_APPROVED_VERIFICATION_TYPES.enum.verified,
  });
  return organization;
}
