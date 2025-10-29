//

import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { context } from "../context";

export const label = "Merci d'utiliser votre adresse officielle de contact";

export default function template() {
  const {
    moderation: {
      organization: { cached_libelle: organization_name },
    },
  } = useContext(context);

  return dedent`
    Bonjour,

    Votre demande pour rejoindre l’organisation « ${organization_name} » a été prise en compte sur https://identite.proconnect.gouv.fr.

    Afin de donner suite à votre demande, merci d’effectuer votre inscription avec votre email officiel de contact ADRESSE, tel que déclaré sur LIEN

    Je reste à votre disposition pour tout complément d’information.

    Excellente journée,
    L’équipe ProConnect.
  `;
}
