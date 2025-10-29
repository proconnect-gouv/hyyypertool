//

import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { context } from "../context";

export const label = "Agent “Communes” —> ComCom, ComAgglo, Métropole";

export default function template() {
  const {
    domain,
    moderation: {
      organization: { cached_libelle: organization_name },
    },
  } = useContext(context);

  return dedent`
    Bonjour,

    Nous avons bien reçu votre demande de rattachement à l'organisation « ${organization_name} » sur ProConnect.

    Votre adresse mail de commune ${domain} ne vous permet pas de rattacher votre compte ProConnect à « ${organization_name} ».
    Nous vous invitons à créer à nouveau votre compte utilisateur, en le rattachant à la commune dans laquelle vous exercez.
    Si vous souhaitez rattacher votre compte à la « ${organization_name} », merci de créer à nouveau votre compte utilisateur avec une adresse mail dont le nom de domaine appartient à la « ${organization_name} ».

    Bien cordialement,
    L’équipe ProConnect.
  `;
}
