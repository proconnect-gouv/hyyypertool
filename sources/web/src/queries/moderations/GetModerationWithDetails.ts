//

import { NotFoundError } from "@~/core/error";
import {
  schema,
  type IdentiteProconnect_PgDatabase,
} from "@~/identite-proconnect/database";
import { eq } from "drizzle-orm";

//

export function GetModerationWithDetails(pg: IdentiteProconnect_PgDatabase) {
  return async function get_moderation_with_details(moderation_id: number) {
    const moderation = await pg.query.moderations.findFirst({
      where: eq(schema.moderations.id, moderation_id),
      with: {
        organization: {
          columns: {
            cached_activite_principale: true,
            cached_adresse: true,
            cached_code_postal: true,
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
        },
        user: {
          columns: {
            created_at: true,
            email: true,
            family_name: true,
            given_name: true,
            id: true,
            job: true,
            last_sign_in_at: true,
            phone_number: true,
            sign_in_count: true,
          },
        },
      },
    });

    if (!moderation) throw new NotFoundError("Moderation not found.");
    return moderation;
  };
}

export type GetModerationWithDetailsHandler = ReturnType<
  typeof GetModerationWithDetails
>;
export type GetModerationWithDetailsDto = Awaited<
  ReturnType<GetModerationWithDetailsHandler>
>;
