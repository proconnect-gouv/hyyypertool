//

import { type HyyyperPgDatabase } from "#src";
import { dedent } from "ts-dedent";
import * as schema from "../schema";

//

export async function insert_central_administration_response(
  db: HyyyperPgDatabase,
  user?: { id: number },
) {
  const insert = await db
    .insert(schema.response_templates)
    .values({
      content: dedent`
      Bonjour,

      Nous avons bien reçu votre demande de rattachement à l&#39;organisation « \${organization_name}  » sur ProConnect (anciennement : AgentConnect, MonComptePro).

      Votre adresse e-mail départementale : « \${email} » ne vous permet pas de rattacher votre compte utilisateur ProConnect à cette administration centrale.
      Nous vous invitons à créer votre compte utilisateur ProConnect à nouveau, en le rattachant à l&#39;administration déconcentrée dans laquelle vous exercez.

      Bien cordialement,
      L’équipe ProConnect.
      `,
      created_at: new Date("2018-07-13T17:35:15+02:00"),
      label: "Agent - adresse e-mail départementale —> Admin centrale",
      updated_at: new Date("2023-06-22T16:34:34+02:00"),
      updated_by: user?.id,
    })
    .returning();
  return insert.at(0)!;
}

export async function insert_domain_name_not_found_response(
  db: HyyyperPgDatabase,
  user?: { id: number },
) {
  const insert = await db
    .insert(schema.response_templates)
    .values({
      content: dedent`
      Bonjour,

      Nous avons bien reçu votre demande de rattachement à l'organisation « \${organization_name} » sur ProConnect (anciennement : AgentConnect, MonComptePro).

      Nous n'avons pas été en mesure de vérifier le nom de domaine de votre adresse mail, afin de le faire correspondre à l'organisation « \${organization_name} »

      Merci de nous faire parvenir un justificatif prouvant votre rattachement à cette organisation, avec vos prénom, nom et adresse mail, signé par le(s) dirigeant(s) de l'organisation.

      Nous vous rappelons que vous ne pouvez pas rattacher votre compte ProConnect à une organisation dont vous êtes prestataire ou mandaté.

      Bien cordialement,
      L'équipe ProConnect.
      `,
      created_at: new Date("2024-11-12T17:55:31+01:00"),
      label: "Nom de domaine introuvable",
      end_user_reason: "Ciao bye",
      updated_at: new Date("2024-11-12T17:55:31+01:00"),
      updated_by: user?.id,
    })
    .returning();
  return insert.at(0)!;
}
