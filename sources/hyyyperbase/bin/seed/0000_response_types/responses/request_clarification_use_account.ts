//

import { dedent } from "ts-dedent";
import type { Values } from "../context";

export const label = "Demande de précisions sur l’usage du compte";

export default function template(values: Values) {
  const {
    moderation: {
      organization: { cached_libelle: organization_name },
    },
  } = values;

  return dedent`
    Bonjour,

    Nous avons bien reçu votre demande de rattachement à l'organisation « ${organization_name} » sur ProConnect.

    Afin de donner suite à cette demande, nous avons besoin d'éléments complémentaires.
    Pourriez-vous nous préciser :

    Pour quelle raison demandez-vous la création d'un compte ProConnect ?

    À quel service souhaitez-vous accéder avec ce compte ?

    Dans l’attente de votre retour.
    Bien cordialement,
    L’équipe ProConnect.
  `;
}
