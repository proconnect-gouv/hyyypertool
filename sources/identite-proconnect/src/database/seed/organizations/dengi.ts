import { EmailDomainVerificationEnum } from "#src/types";
import type { IdentiteProconnectPgDatabase } from "../..";
import { schema } from "../..";

export async function insert_dengi(db: IdentiteProconnectPgDatabase) {
  const insert = await db
    .insert(schema.organizations)
    .values({
      cached_activite_principale: "47.11F",
      cached_adresse: "route de souchez, 62143 Angres",
      cached_categorie_juridique: "5710",
      cached_code_officiel_geographique: "62032",
      cached_code_postal: "62143",
      cached_enseigne: "LECLERC",
      cached_est_active: true,
      cached_est_diffusible: true,
      cached_etat_administratif: "A",
      cached_libelle_activite_principale: "47.11F - Hypermarchés",
      cached_libelle_categorie_juridique: "SAS, société par actions simplifiée",
      cached_libelle_tranche_effectif: "50 à 99 salariés, en 2022",
      cached_libelle: "Dengi - Leclerc",
      cached_nom_complet: "Dengi",
      cached_statut_diffusion: "diffusible",
      cached_tranche_effectifs: "21",
      cached_tranche_effectifs_unite_legale: "22",
      created_at: "2024-01-19T21:07:26.917+00:00",
      organization_info_fetched_at: "2025-02-27T07:52:35.288+00:00",
      siret: "38514019900014",
      updated_at: "2025-02-27T07:52:35.288+00:00",
    })
    .returning();

  const organization = insert.at(0)!;
  await db.insert(schema.email_domains).values({
    domain: "scapartois.fr",
    organization_id: organization.id,
    verification_type: EmailDomainVerificationEnum.enum.verified,
  });
  return organization;
}
