//

import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { context } from "../context";

export const label = "Lien avec l’organisation choisie";

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

    Le nom de domaine de votre adresse e-mail : « ${email} » ne nous permet pas d’établir un lien entre vous et l’organisation « ${organization_name} ».
    Afin de donner suite à votre demande, pourriez-vous nous préciser le lien que vous avez cette organisation ?

    Bien cordialement,
    L’équipe ProConnect.
  `;
}
