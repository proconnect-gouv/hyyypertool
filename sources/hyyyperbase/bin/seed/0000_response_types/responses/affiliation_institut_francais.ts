//

import { dedent } from "ts-dedent";
import type { Values } from "../context";

export const label =
  "Demande de rattachement à la Fondation « Institut Français »";

export default function template(values: Values) {
  const {
    domain,
    moderation: {
      organization: { cached_libelle: organization_name },
    },
  } = values;

  return dedent`
    Bonjour,

    Nous avons bien reçu votre demande de rattachement à l'organisation « ${organization_name} » sur ProConnect.

    Votre adresse mail associée au nom de domaine d’un institut français « ${domain} » ne vous permet pas de rattacher votre compte ProConnect à l'organisation « ${organization_name} ».

    Veuillez créer à nouveau votre compte ProConnect en le rattachant à l'organisation suivante :

    - INSTITUT FRANCAIS
    - SIRET : 52971592200041.

    Bien cordialement,

    L’équipe ProConnect.
  `;
}
