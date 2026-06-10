import { EmailDomainVerificationEnum } from "#src/types";
import type { IdentiteProconnectPgDatabase } from "../..";
import { schema } from "../..";

export async function insert_dinum(db: IdentiteProconnectPgDatabase) {
  const insert = await db
    .insert(schema.organizations)
    .values({
      cached_activite_principale: "84.11Z",
      cached_adresse: "20 avenue de segur, 75007 Paris",
      cached_categorie_juridique: "7120",
      cached_code_officiel_geographique: "75107",
      cached_code_postal: "75007",
      cached_enseigne: "",
      cached_est_active: true,
      cached_est_diffusible: true,
      cached_etat_administratif: "A",
      cached_libelle_activite_principale:
        "84.11Z - Administration publique générale",
      cached_libelle_categorie_juridique: "Service central d'un ministère",
      cached_libelle_tranche_effectif: "250 à 499 salariés, en 2023",
      cached_libelle: "Direction interministerielle du numerique (DINUM)",
      cached_nom_complet: "Direction interministerielle du numerique (DINUM)",
      cached_siege_social: true,
      cached_statut_diffusion: "diffusible",
      cached_tranche_effectifs: "32",
      cached_tranche_effectifs_unite_legale: "32",
      created_at: "1970-01-01T00:00:00+00:00",
      siret: "13002526500013",
      updated_at: "2023-06-22T16:34:34+02:00",
    })
    .returning();

  const organization = insert.at(0)!;
  await db.insert(schema.email_domains).values({
    domain: "beta.gouv.fr",
    organization_id: organization.id,
    verification_type: EmailDomainVerificationEnum.enum.verified,
  });
  await db.insert(schema.email_domains).values({
    domain: "modernisation.gouv.fr",
    organization_id: organization.id,
    verification_type: EmailDomainVerificationEnum.enum.verified,
  });
  await db.insert(schema.email_domains).values({
    domain: "prestataire.modernisation.gouv.fr",
    organization_id: organization.id,
    verification_type: EmailDomainVerificationEnum.enum.external,
  });
  return organization;
}
