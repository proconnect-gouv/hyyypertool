//

import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { context } from "../context";

export const label = "Agent - adresse e-mail départementale —> Admin centrale";

export default function template() {
  const {
    moderation: {
      organization: { cached_libelle: organization_name },
      user: { email },
    },
  } = useContext(context);

  return dedent`
    Bonjour,

    Nous avons bien reçu votre demande de rattachement à l'organisation « ${organization_name} » sur ProConnect (anciennement : AgentConnect, MonComptePro).

    Votre adresse e-mail départementale : « ${email} » ne vous permet pas de rattacher votre compte utilisateur ProConnect à cette administration centrale. 
    Nous vous invitons à créer votre compte utilisateur ProConnect à nouveau, en le rattachant à l'administration déconcentrée dans laquelle vous exercez.

    Bien cordialement,
    L’équipe ProConnect.
  `;
}
