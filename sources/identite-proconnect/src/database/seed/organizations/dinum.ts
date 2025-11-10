import type { EmailDomainVerificationType } from "@~/identite-proconnect/database";
import type { IdentiteProconnect_PgDatabase } from "../..";
import { schema } from "../..";

export async function insert_dinum(db: IdentiteProconnect_PgDatabase) {
  const insert = await db
    .insert(schema.organizations)
    .values({
      cached_activite_principale: "84.11Z - Administration publique générale",
      cached_adresse: "20 avenue de segur, 75007 Paris",
      cached_categorie_juridique: "Service central d'un ministère",
      cached_code_officiel_geographique: "75107",
      cached_code_postal: "75015",
      cached_est_active: true,
      cached_etat_administratif: "A",
      cached_libelle_activite_principale:
        "84.11Z - Administration publique générale",
      cached_libelle_categorie_juridique:
        "SA nationale à conseil d'administration",
      cached_libelle_tranche_effectif: "100 à 199 salariés, en 2021",
      cached_libelle: "DINUM",
      cached_nom_complet: "Direction interministerielle du numerique (DINUM)",
      cached_tranche_effectifs: "22",
      created_at: "2018-07-13T17:35:15+02:00",
      siret: "13002526500013",
      updated_at: "2023-06-22T16:34:34+02:00",
    })
    .returning();

  const organization = insert.at(0)!;
  await db.insert(schema.email_domains).values({
    domain: "beta.gouv.fr",
    organization_id: organization.id,
    verification_type: "verified" satisfies EmailDomainVerificationType,
  });
  await db.insert(schema.email_domains).values({
    domain: "modernisation.gouv.fr",
    organization_id: organization.id,
    verification_type: "verified" satisfies EmailDomainVerificationType,
  });
  await db.insert(schema.email_domains).values({
    domain: "prestataire.modernisation.gouv.fr",
    organization_id: organization.id,
    verification_type: "external" satisfies EmailDomainVerificationType,
  });
  return organization;
}
