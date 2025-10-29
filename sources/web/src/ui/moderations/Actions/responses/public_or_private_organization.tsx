//

import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { context } from "../context";

export const label = "Prestataires privés —> Organisation publique ou privée ";

export default function template() {
  const {
    moderation: {
      organization: { cached_libelle: organization_name },
    },
  } = useContext(context);

  return dedent`
    Bonjour,

    Nous avons bien reçu votre demande de rattachement à l'organisation « ${organization_name} » sur ProConnect (anciennement : AgentConnect, MonComptePro).

    Si vous travaillez ou êtes mandaté par l'organisation « ${organization_name} », demandez-lui de vous attribuer une adresse e-mail spécifique pour les prestataires. Vous pourrez ainsi l'utiliser dans le cadre de votre mission.
    Autrement, si cela est possible, veuillez accéder au service souhaité sans passer par ProConnect.

    Bien cordialement,
    L’équipe ProConnect.
  `;
}
