//

import type { EmailDomainVerificationType } from "#src/types";
import { schema, type IdentiteProconnectPgDatabase } from "../..";

export async function insert_yes_we_hack(pg: IdentiteProconnectPgDatabase) {
  const [{ id: organization_id } = { id: NaN }] = await pg
    .insert(schema.organizations)
    .values({
      cached_activite_principale: "62.09Z",
      cached_adresse: "14 rue charles v, 75004 Paris",
      cached_categorie_juridique: "5710",
      cached_code_officiel_geographique: "75104",
      cached_code_postal: "75004",
      cached_enseigne: "",
      cached_est_active: true,
      cached_est_diffusible: true,
      cached_etat_administratif: "A",
      cached_libelle_activite_principale:
        "62.09Z - Autres activités informatiques",
      cached_libelle_categorie_juridique: "SAS, société par actions simplifiée",
      cached_libelle_tranche_effectif: "20 à 49 salariés, en 2021",
      cached_libelle: "Yes we hack",
      cached_nom_complet: "Yes we hack",
      cached_statut_diffusion: "O",
      cached_tranche_effectifs_unite_legale: "21",
      cached_tranche_effectifs: "12",
      created_at: "2023-12-19T10:02:33.274+02:00",
      organization_info_fetched_at: "2024-09-24T09:15:41.308+02:00",
      siret: "81403721400016",
      updated_at: "2024-09-24T09:15:41.308+02:00",
    })
    .returning({ id: schema.organizations.id });

  await pg.insert(schema.email_domains).values({
    organization_id,
    domain: "yeswehack.com",
    verification_type: null satisfies EmailDomainVerificationType,
    can_be_suggested: true,
    verified_at: "2024-03-26T05:37:24.197+02:00",
    created_at: "2023-12-19T10:02:33.274+02:00",
    updated_at: "2024-03-26T05:37:24.197+02:00",
  });

  return organization_id;
}
