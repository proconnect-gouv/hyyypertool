//

import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { context } from "../context";

export const label = "Enseignant e-mail educagri.fr —> Min de l’Agriculture";

export default function template() {
  const {
    domain,
    moderation: {
      organization: { cached_libelle: organization_name },
    },
  } = useContext(context);

  return dedent`
    Bonjour,

    Nous avons bien reçu votre demande de rattachement à l'organisation « ${organization_name} » sur ProConnect.

    Votre adresse mail d’enseignement agricole : « ${domain} » ne vous permet pas de rattacher votre compte utilisateur ProConnect au « ${organization_name} ».
    En tant qu'enseignant, merci de bien vouloir renouveler votre inscription en rattachant votre compte à l'Établissement Public Local d'Enseignement et de Formation Professionnelle Agricoles (EPLEFPA) dans lequel vous exercez.

    Bien cordialement,
    L’équipe ProConnect.
  `;
}
