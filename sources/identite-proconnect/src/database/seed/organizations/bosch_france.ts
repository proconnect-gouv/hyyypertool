//

import { schema, type IdentiteProconnectPgDatabase } from "../..";

//

export async function insert_bosch_france(pg: IdentiteProconnectPgDatabase) {
  const [{ id: organization_id } = { id: NaN }] = await pg
    .insert(schema.organizations)
    .values({
      cached_activite_principale: "29.32Z",
      cached_adresse: "32 avenue michelet, 93400 Saint-ouen-sur-seine",
      cached_categorie_juridique: "5710",
      cached_code_officiel_geographique: "93070",
      cached_code_postal: "93400",
      cached_enseigne: "",
      cached_est_active: true,
      cached_est_diffusible: true,
      cached_etat_administratif: "A",
      cached_libelle_activite_principale:
        "29.32Z - Fabrication d'autres équipements automobiles",
      cached_libelle_categorie_juridique: "SAS, société par actions simplifiée",
      cached_libelle_tranche_effectif: "500 à 999 salariés, en 2022",
      cached_libelle: "Robert bosch france",
      cached_nom_complet: "Robert bosch france",
      cached_statut_diffusion: "diffusible",
      cached_tranche_effectifs: "41",
      cached_tranche_effectifs_unite_legale: "51",
      created_at: "2024-01-19T21:27:42.009+00:00",
      organization_info_fetched_at: "2025-02-24T08:34:25.731+00:00",
      siret: "57206768400017",
      updated_at: "2025-02-24T08:34:25.731+00:00",
    })
    .returning({ id: schema.organizations.id });

  return organization_id;
}
