//

import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { context } from "../context";

export const label = "Nom de domaine introuvable";

export default function template() {
  const {
    moderation: {
      organization: { cached_libelle: organization_name },
    },
  } = useContext(context);

  return dedent`
    Bonjour,

    Nous avons bien reçu votre demande de rattachement à l'organisation « ${organization_name} » sur ProConnect (anciennement : AgentConnect, MonComptePro).

    Nous n'avons pas été en mesure de vérifier le nom de domaine de votre adresse mail, afin de le faire correspondre à l'organisation « ${organization_name} »

    Merci de nous faire parvenir un justificatif prouvant votre rattachement à cette organisation, avec vos prénom, nom et adresse mail, signé par le(s) dirigeant(s) de l'organisation.

    Nous vous rappelons que vous ne pouvez pas rattacher votre compte ProConnect à une organisation dont vous êtes prestataire ou mandaté.

    Bien cordialement,
    L’équipe ProConnect.
  `;
}
