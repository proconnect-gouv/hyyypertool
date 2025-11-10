//

import { NotFoundError } from "@~/core/error";
import type { IdentiteProconnectDatabaseCradle } from "@~/identite-proconnect/database";

export function GetFicheOrganizationById({
  pg,
}: IdentiteProconnectDatabaseCradle) {
  return async function get_fiche_organization_by_id(id: number) {
    const organization = await pg.query.organizations.findFirst({
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
      where: (table, { eq }) => eq(table.id, id),
    });

    if (!organization) throw new NotFoundError("Organization not found.");
    return organization;
  };
}

export type GetFicheOrganizationByIdHandler = ReturnType<
  typeof GetFicheOrganizationById
>;
