//

import { schema, type IdentiteProconnectPgDatabase } from "../..";

export async function insert_bosch_rexroth(pg: IdentiteProconnectPgDatabase) {
  const [{ id: organization_id } = { id: NaN }] = await pg
    .insert(schema.organizations)
    .values({
      cached_activite_principale: "28.12Z",
      cached_categorie_juridique: "SAS, société par actions simplifiée",
      cached_code_officiel_geographique: "69259",
      cached_est_active: true,
      cached_etat_administratif: "A",
      cached_libelle_activite_principale:
        "29.12Z - Fabrication d'autres équipements automobiles",
      cached_libelle_tranche_effectif: "250 à 499 salariés, en 2021",
      cached_libelle: "Bosch rexroth d.s.i.",
      cached_nom_complet: "Bosch rexroth d.s.i.",
      cached_tranche_effectifs: "41",
      created_at: "2024-01-19T22:27:42.009+02:00",
      siret: "44023386400014 ",
      updated_at: "2024-02-15T14:45:32.598+02:00",
    })
    .returning({ id: schema.organizations.id });

  await pg.insert(schema.email_domains).values({
    domain: "fr.bosch.com",
    organization_id,
    verification_type: "verified",
    can_be_suggested: true,
    verified_at: "2022-05-11T17:31:44.199+02:00",
    created_at: "2022-04-11T17:31:44.199+02:00",
    updated_at: "2022-04-11T17:31:44.199+02:00",
  });

  return organization_id;
}
