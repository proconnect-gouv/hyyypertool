//

import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { context } from "../context";

export const label = "refus comptable";

export default function template() {
  const {
    moderation: {
      organization: { cached_libelle: organization_name },
    },
  } = useContext(context);

  return dedent`
    Bonjour,

    Concernant votre demande pour rejoindre l'organisation « ${organization_name} » faites sur https://identite.proconnect.gouv.fr.
    La connexion à notre plateforme est pour le moment restreinte aux seuls membres de l'organisation que vous souhaitez représenter.
    Nous vous prions de bien vouloir contacter directement l'organisation que vous représentez afin qu'elle effectue la démarche elle même.
    Nous vous remercions de votre compréhension et restons à votre disposition pour toute assistance complémentaire.

    Excellente journée
  `;
}
