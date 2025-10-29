//

import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { context } from "../context";

export const label = "Agent “ComCom, ComAgglo, Métropole” —> Communes";

export default function template() {
  const {
    moderation: {
      organization: { cached_libelle: organization_name },
    },
  } = useContext(context);

  return dedent`
    Bonjour,

    Nous avons bien reçu votre demande de rattachement à l'organisation « ${organization_name} » sur ProConnect (anciennement : AgentConnect, MonComptePro).

    Votre adresse e-mail de commune NOM DE DOMAINE DE LA COMMUNE COMCOM ne vous permet pas de rattacher votre compte ProConnect à ${organization_name}.

    Nous vous invitons à créer à nouveau votre compte utilisateur, en le rattachant à la communauté de communes dans laquelle vous exercez et correspondant au nom de domaine de votre adresse e-mail.

    Si vous souhaitez rejoindre NOM DE LA COMMUNE, merci de créer à nouveau votre compte utilisateur avec une adresse e-mail dont le nom de domaine appartient à NOM DE LA COMMUNE.

    Merci de votre compréhension,

    Bien cordialement,
    L’équipe ProConnect.
  `;
}
