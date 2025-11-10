import type { EmailDomainVerificationType } from "@~/identite-proconnect/database";
import type { IdentiteProconnect_PgDatabase } from "../..";
import { schema } from "../..";

export async function insert_sak(db: IdentiteProconnect_PgDatabase) {
  const insert = await db
    .insert(schema.organizations)
    .values({
      siret: "20006967200018",
      created_at: "1970-01-01T00:00:00+02:00",
      updated_at: "1970-01-01T00:00:00+02:00",
      cached_libelle: "Cc du ternois",
      cached_nom_complet: "Cc du ternois",
      cached_enseigne: null,
      cached_tranche_effectifs: "31",
      cached_tranche_effectifs_unite_legale: "32",
      cached_libelle_tranche_effectif: "200 à 249 salariés, en 2019",
      cached_etat_administratif: "F",
      cached_est_active: false,
      cached_statut_diffusion: "O",
      cached_est_diffusible: true,
      cached_adresse:
        "8 place francois mitterrand, 62130 Saint-pol-sur-ternoise",
      cached_code_postal: "62130",
      cached_activite_principale: "84.11Z",
      cached_libelle_activite_principale:
        "84.11Z - Administration publique générale",
      cached_categorie_juridique: "7346",
      cached_libelle_categorie_juridique: "Communauté de communes",
      organization_info_fetched_at: "2022-08-08T16:17:39.373+02:00",
      cached_code_officiel_geographique: null,
    })
    .returning();

  const organization = insert.at(0)!;
  await db.insert(schema.email_domains).values([
    {
      organization_id: organization.id,
      domain: "ternoiscom.fr",
      verification_type: null satisfies EmailDomainVerificationType,
      can_be_suggested: true,
      verified_at: null,
      created_at: "1970-01-01T00:00:00+02:00",
      updated_at: "1970-01-01T00:00:00+02:00",
    },
  ]);

  return organization;
}
