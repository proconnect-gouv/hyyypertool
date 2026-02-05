//

import { dedent } from "ts-dedent";
import type { Values } from "../context";

export const label = "Étudiant - Organisation d’accueil (stage, alternance…)";

export default function template(values: Values) {
  const {
    moderation: {
      organization: { cached_libelle: organization_name },
    },
  } = values;

  return dedent`
    Bonjour,

    Nous avons bien reçu votre demande de rattachement à l'organisation « ${organization_name} » sur ProConnect (anciennement : AgentConnect, MonComptePro).

    Nous ne pouvons donner suite à votre demande, car les étudiants ne sont pas autorisés à utiliser ProConnect en se rattachant à leur organisation d'accueil.
    Veuillez accéder au service souhaité sans passer par ProConnect.

    Bien cordialement,
    L’équipe ProConnect.
  `;
}
