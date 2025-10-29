//

import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { context } from "../context";

export const label =
  "Agent - e-mail universitaire —> CNRS - Cnrs moy1601 presidence";

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

    Votre adresse e-mail universitaire : « ${domain} » ne vous permet pas de rattacher votre compte utilisateur au CNRS - Cnrs moy1601 presidence. 
    Nous vous invitons à créer à nouveau votre compte utilisateur ProConnect, en le rattachant à l'établissement ou à l’université correspondante à votre adresse e-mail.

    Bien cordialement,
    L’équipe ProConnect.
  `;
}
