//

import { dedent } from "ts-dedent";
import type { Values } from "../context";

export const label =
  "Prestataires - E-mail Organisation employeuse ou beta.gouv —> Admin publique";

export default function template(values: Values) {
  const {
    domain,
    moderation: {
      organization: { cached_libelle: organization_name },
    },
  } = values;

  return dedent`
    Bonjour, 

    Nous avons bien reçu votre demande de rattachement à l'organisation « ${organization_name} » sur ProConnect (anciennement : AgentConnect, MonComptePro).

    Votre adresse e-mail associée au nom de domaine « ${domain} » vous permet de rattacher votre compte utilisateur ProConnect exclusivement à la DINUM.
    Si vous travaillez pour l'organisation « ${organization_name} », demandez-lui de vous attribuer une adresse e-mail spécifique pour les prestataires. Vous pourrez ainsi l'utiliser dans le cadre de votre mission.
    Autrement, si cela est possible, veuillez accéder au service souhaité sans passer par ProConnect.

    Bien cordialement,
    L’équipe ProConnect.
  `;
}
