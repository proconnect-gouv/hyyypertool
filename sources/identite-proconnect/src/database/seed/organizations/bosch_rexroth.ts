//

import type { EmailDomainVerificationType } from "#src/types";
import { schema, type IdentiteProconnectPgDatabase } from "../..";

export async function insert_bosch_rexroth(pg: IdentiteProconnectPgDatabase) {
  const [{ id: organization_id } = { id: NaN }] = await pg
    .insert(schema.organizations)
    .values({
      cached_activite_principale: "28.12Z",
      cached_adresse: "91 boulevard irene joliot curie, 69200 Venissieux",
      cached_categorie_juridique: "5710",
      cached_code_officiel_geographique: "69259",
      cached_code_postal: "69200",
      cached_enseigne: "",
      cached_est_active: true,
      cached_est_diffusible: true,
      cached_etat_administratif: "A",
      cached_libelle_activite_principale:
        "28.12Z - Fabrication d'équipements hydrauliques et pneumatiques",
      cached_libelle_categorie_juridique: "SAS, société par actions simplifiée",
      cached_libelle_tranche_effectif: "250 à 499 salariés, en 2021",
      cached_libelle: "Bosch rexroth d.s.i.",
      cached_nom_complet: "Bosch rexroth d.s.i.",
      cached_statut_diffusion: "diffusible",
      cached_tranche_effectifs: "32",
      cached_tranche_effectifs_unite_legale: "32",
      created_at: "2024-01-19T21:28:55.159+00:00",
      organization_info_fetched_at: "2024-02-14T17:02:14.26+00:00",
      siret: "44023386400014",
      updated_at: "2024-02-14T17:02:14.26+00:00",
    })
    .returning({ id: schema.organizations.id });

  await pg.insert(schema.email_domains).values({
    domain: "fr.bosch.com",
    organization_id,
    verification_type: "verified" satisfies EmailDomainVerificationType,
    can_be_suggested: true,
    verified_at: "2022-05-11T17:31:44.199+02:00",
    created_at: "2022-04-11T17:31:44.199+02:00",
    updated_at: "2022-04-11T17:31:44.199+02:00",
  });

  return organization_id;
}
