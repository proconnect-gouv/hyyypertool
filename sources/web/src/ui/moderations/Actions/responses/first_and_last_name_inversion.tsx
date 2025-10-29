//

import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { context } from "../context";

export const label = "Inversion Nom et Prénom";

export default function template() {
  const {
    moderation: {
      organization: { cached_libelle: organization_name },
    },
  } = useContext(context);

  return dedent`
    Bonjour,

    Nous avons bien reçu votre demande de rattachement à l'organisation « ${organization_name} » sur ProConnect (anciennement : AgentConnect, MonComptePro).

    Vous semblez avoir inversé votre nom et votre prénom, pourriez-vous corriger cela ?

    Pour se faire :

    - Accédez à votre compte ProConnect en cliquant sur le lien suivant : https://identite.proconnect.gouv.fr/users/personal-information,
    - Authentifiez-vous si cela vous est demandé par l'interface,
    - Corrigez votre prénom et votre nom,
    - Sélectionnez votre organisation (numéro SIRET : {siret}) pour que notre équipe puisse valider à nouveau la création de votre compte.

    Merci pour votre correction.
    Bien cordialement,
    L’équipe ProConnect.
`;
}
