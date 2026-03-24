//

import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { context } from "../context";

export const label =
  "Demande de justification du lien entre organisation choisie & organisation du domaine e-mail";

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

    Le nom de domaine de votre adresse mail : « ${domain} » ne nous permet pas d’établir un lien entre vous et l’organisation « ${organization_name} ».
    Afin de donner suite à votre demande, pourriez-vous nous transmettre un justificatif légal (type KBIS ou autre) attestant du lien entre l’organisation « ${organization_name} » et celle correspondant à votre nom de domaine ?

    Bien cordialement,
    L’équipe ProConnect.
  `;
}
