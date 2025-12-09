//

import { schema, type IdentiteProconnectPgDatabase } from "../..";

//

export async function insert_bosch_france(pg: IdentiteProconnectPgDatabase) {
  const [{ id: organization_id } = { id: NaN }] = await pg
    .insert(schema.organizations)
    .values({
      cached_activite_principale: "29.32Z",
      cached_categorie_juridique: "SAS, société par actions simplifiée",
      cached_code_officiel_geographique: "93070",
      cached_est_active: true,
      cached_etat_administratif: "A",
      cached_libelle_activite_principale:
        "29.32Z - Fabrication d'autres équipements automobiles",
      cached_libelle_tranche_effectif: "500 à 999 salariés, en 2021",
      cached_libelle: "Robert bosch france",
      cached_nom_complet: "Robert bosch france",
      cached_tranche_effectifs: "41",
      created_at: "2024-01-19T22:27:42.009+02:00",
      siret: "57206768400017",
      updated_at: "2024-02-15T14:45:32.598+02:00",
    })
    .returning({ id: schema.organizations.id });

  return organization_id;
}
