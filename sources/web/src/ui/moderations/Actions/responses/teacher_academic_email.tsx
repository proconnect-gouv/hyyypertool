//

import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { context } from "../context";

export const label =
  "Enseignant : e-mail académique —> Min Edu Nat et Jeunesse";

export default function template() {
  const {
    moderation: {
      organization: { cached_libelle: organization_name },
      user: { email },
    },
  } = useContext(context);

  return dedent`
    Bonjour,

    Votre demande pour rejoindre l’organisation « ${organization_name} » a été prise en compte sur https://identite.proconnect.gouv.fr.

    Votre adresse e-mail académique : « ${email} » ne vous permet pas de rattacher votre compte utilisateur MonComptePro au Ministère de l’Éducation Nationale et de la Jeunesse. 

    En tant qu’enseignant, merci de bien vouloir créer votre compte à nouveau en le rattachant à l’une des organisations suivantes :
    
    - L’établissement scolaire dans lequel vous exercez,
    - Le rectorat de votre Académie.

    Bien cordialement, 
    L’équipe ProConnect.
  `;
}
