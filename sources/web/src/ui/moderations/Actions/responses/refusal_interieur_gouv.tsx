//

import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { context } from "../context";

export const label = "Agent Interieur.gouv - FI sur PCF";

export default function template() {
  const {
    moderation: {
      organization: { cached_libelle: organization_name },
    },
  } = useContext(context);

  return dedent`
    Bonjour,

    Nous avons bien reçu votre demande de rattachement à l'organisation « ${organization_name} » sur ProConnect.

    Pour des raisons de sécurité, il ne vous est pas possible de créer directement un compte sur ProConnect. Vous devez impérativement passer par votre Portail d’authentification CALYPSSO ou PASSAGE2 pour vous connecter.
    Pour y accéder via ProConnect, voici les étapes à suivre :
    * Cliquez sur le bouton « S’identifier avec ProConnect »,
    * Saisissez attentivement votre adresse e-mail en interieur.gouv.fr dans le champ prévu,
    * Sélectionnez votre Portail d’authentification : PASSAGE2 ou CALYPSSO,
    * Saisissez votre identifiant de connexion et votre mot de passe afin de finaliser l’authentification.

    Si vous ne parvenez pas à vous authentifier OU à réinitialiser votre mot de passe sur votre portail d’authentification, veuillez contacter votre service informatique pour une assistance.

    Bien cordialement,
    L’équipe ProConnect.
  `;
}
