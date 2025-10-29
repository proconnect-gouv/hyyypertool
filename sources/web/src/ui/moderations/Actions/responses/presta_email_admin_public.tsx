//

import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { context } from "../context";

export const label =
  "Prestataires - E-mail Admin publique —> Organisation employeuse";

export default function template() {
  const {
    domain,
    moderation: {
      organization: { cached_libelle: organization_name },
    },
  } = useContext(context);

  return dedent`
    Bonjour, 

    Nous avons bien reçu votre demande de rattachement à l'organisation « ${organization_name} » sur ProConnect (anciennement : AgentConnect, MonComptePro).

    Si vous créez votre compte utilisateur ProConnect pour accéder à des services de l'État, proposant le bouton d'authentification « S'identifier avec ProConnect », veuillez renouveler la création de votre compte utilisateur en le rattachant à l'organisation que vous représentez avec votre adresse e-mail en « ${domain} ».
    Pour précision, vous n'êtes pas autorisé à rattacher un compte utilisateur associé à votre adresse e-mail de prestataire d'une administration publique, à l'organisation privée qui vous emploie.

    Bien cordialement,
    L’équipe ProConnect.
  `;
}
