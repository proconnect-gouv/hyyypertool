import type { EmailDomainVerificationType } from "@~/identite-proconnect/types";
import type { IdentiteProconnect_PgDatabase } from "../..";
import { schema } from "../..";

//
export async function insert_abracadabra(db: IdentiteProconnect_PgDatabase) {
  const insert = await db
    .insert(schema.organizations)
    .values({
      cached_activite_principale:
        "90.02Z - Activités de soutien au spectacle vivant",
      cached_categorie_juridique:
        "Société à responsabilité limitée (sans autre indication)",
      cached_est_active: false,
      cached_etat_administratif: "A",
      cached_libelle_tranche_effectif: "10 à 19 salariés, en 2019",
      cached_libelle: "Abracadabra",
      cached_nom_complet: "Abracadabra (ABRACADABRA)",
      cached_tranche_effectifs: "11",
      created_at: "2022-08-08T17:43:15.501+02:00",
      organization_info_fetched_at: "2022-08-08T17:43:15.501+02:00",
      siret: "51935970700022",
      updated_at: "2022-08-08T17:43:15.501+02:00",
    })
    .returning();

  const organization = insert.at(0)!;
  await db.insert(schema.email_domains).values([
    // TODO(douglasduteil): add more domains
    // {
    //   domain: "abracadabra.com",
    //   organization_id: organization.id,
    //   verification_type: "verified",
    // },
    {
      domain: "yopmail.com",
      organization_id: organization.id,
      verification_type: null satisfies EmailDomainVerificationType,
    },
    // {
    //   domain: "mailslurp.com",
    //   organization_id: organization.id,
    //   verification_type: "external",
    // },
    // {
    //   domain: "gmail.com",
    //   organization_id: organization.id,
    //   verification_type: "blacklisted",
    // },
    // {
    //   domain: "shazam.com",
    //   organization_id: organization.id,
    //   verification_type: "official_contact",
    // },
    // {
    //   domain: "flipendo.com",
    //   organization_id: organization.id,
    //   verification_type: "trackdechets_postal_mail",
    // },
  ]);

  return organization;
}
