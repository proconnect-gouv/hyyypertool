import { EmailDomainVerificationEnum } from "#src/types";
import type { IdentiteProconnectPgDatabase } from "../..";
import { schema } from "../..";

export async function insert_aldp(db: IdentiteProconnectPgDatabase) {
  const insert = await db
    .insert(schema.organizations)
    .values({
      cached_activite_principale: "94.99Z",
      cached_adresse: "9 rue camille desmoulins, 66000 Perpignan",
      cached_categorie_juridique: "9220",
      cached_code_officiel_geographique: null,
      cached_code_postal: "66000",
      cached_enseigne: null,
      cached_est_active: true,
      cached_est_diffusible: true,
      cached_etat_administratif: "A",
      cached_libelle_activite_principale:
        "94.99Z - Autres organisations fonctionnant par adhésion volontaire",
      cached_libelle_categorie_juridique: "Association déclarée",
      cached_libelle_tranche_effectif: "50 à 99 salariés, en 2019",
      cached_libelle:
        "Association des loisirs de la diversite et du partage (ALDP)",
      cached_nom_complet:
        "Association des loisirs de la diversite et du partage (ALDP)",
      cached_statut_diffusion: "diffusible",
      cached_tranche_effectifs: "21",
      cached_tranche_effectifs_unite_legale: "21",
      created_at: "2022-02-03T11:27:30.48+00:00",
      organization_info_fetched_at: "2022-08-08T17:07:55.822+00:00",
      siret: "81797266400038",
      updated_at: "2022-02-03T11:27:30.48+00:00",
    })
    .returning();
  const organization = insert.at(0)!;
  await db.insert(schema.email_domains).values({
    domain: "aldp-asso.fr",
    organization_id: organization.id,
    verification_type: EmailDomainVerificationEnum.enum.verified,
  });
  return organization;
}
