//

import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { context } from "../context";

export const label =
  "CNRS : Établissement plus précis existant —> CNRS - Cnrs moy1601 presidence";

export default function template() {
  const {
    domain,
    moderation: {
      organization: { cached_libelle: organization_name },
    },
  } = useContext(context);

  return dedent`
    Bonjour,

    Nous avons bien reçu votre demande de rattachement à l'organisation « ${organization_name} » sur ProConnect (anciennement : AgentConnect, MonComptePro).

    Afin de donner suite à votre demande, merci de créer votre compte utilisateur ProConnect à nouveau, en le rattachant à l'organisation correspondant au nom de domaine de votre adresse e-mail « ${domain} » :
    LIBELLÉ DE L’ORGANISATION 
    SIRET ORGANISATION

    Bien cordialement,
    L’équipe ProConnect.
  `;
}
