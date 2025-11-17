//

import { GetOrganizationById } from "#src/queries/organizations";
import type { IdentiteProconnect_PgDatabase } from "@~/identite-proconnect/database";

//

export async function get_organization_by_id(
  pg: IdentiteProconnect_PgDatabase,
  id: number,
) {
  const get_organization_by_id_handler = GetOrganizationById(pg, {
    columns: {
      cached_activite_principale: true,
      cached_adresse: true,
      cached_categorie_juridique: true,
      cached_code_officiel_geographique: true,
      cached_code_postal: true,
      cached_enseigne: true,
      cached_est_active: true,
      cached_etat_administratif: true,
      cached_libelle_activite_principale: true,
      cached_libelle_categorie_juridique: true,
      cached_libelle_tranche_effectif: true,
      cached_libelle: true,
      cached_nom_complet: true,
      cached_tranche_effectifs: true,
      created_at: true,
      id: true,
      siret: true,
      updated_at: true,
    },
  });

  return get_organization_by_id_handler(id);
}
