//

import { schema, type IdentiteProconnectPgDatabase } from "../..";

export async function insert_commune_de_pompierre(
  pg: IdentiteProconnectPgDatabase,
) {
  const [{ id: organization_id } = { id: NaN }] = await pg
    .insert(schema.organizations)
    .values({
      cached_activite_principale: "84.11Z",
      cached_adresse: "6 rue du chevalier de la barre, 88300 Pompierre",
      cached_categorie_juridique: "7210",
      cached_code_officiel_geographique: null,
      cached_code_postal: "88300",
      cached_enseigne: "Mairie",
      cached_est_active: true,
      cached_est_diffusible: true,
      cached_etat_administratif: "A",
      cached_libelle_activite_principale:
        "84.11Z - Administration publique générale",
      cached_libelle_categorie_juridique: "Commune et commune nouvelle",
      cached_libelle_tranche_effectif: "1 ou 2 salariés, en 2019",
      cached_libelle: "Commune de pompierre - Mairie",
      cached_nom_complet: "Commune de pompierre",
      cached_statut_diffusion: "O",
      cached_tranche_effectifs_unite_legale: "02",
      cached_tranche_effectifs: "01",
      created_at: "2022-04-11T15:31:44.199+02:00",
      organization_info_fetched_at: "2022-08-08T17:36:27.443+02:00",
      siret: "21880352600019",
      updated_at: "2022-04-11T15:31:44.199+02:00",
    })
    .returning({ id: schema.organizations.id });

  await pg.insert(schema.email_domains).values({
    organization_id,
    domain: "9online.fr",
    verification_type: null,
    can_be_suggested: true,
    verified_at: null,
    created_at: "2022-04-11T15:31:44.199+02:00",
    updated_at: "2022-04-11T15:31:44.199+02:00",
  });

  return organization_id;
}
