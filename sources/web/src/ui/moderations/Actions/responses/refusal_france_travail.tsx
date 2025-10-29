//

import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { context } from "../context";

export const label = "Agent France Travail - FI sur PCF";

export default function template() {
  const {
    moderation: {
      organization: { cached_libelle: organization_name },
    },
  } = useContext(context);

  return dedent`
    Bonjour,
    
    Nous avons bien reçu votre demande de rattachement à l'organisation « ${organization_name} » sur ProConnect.

    Pour des raisons de sécurité, il ne vous est pas possible de créer directement un compte sur ProConnect. 
    Vous devez impérativement passer par le Portail d'authentification de France Travail « Neptune » pour vous connecter.
    Pour accéder à votre Portail via ProConnect, voici les étapes à suivre pour garantir une connexion réussie :
    * Cliquez sur le bouton « S’identifier avec ProConnect ».
    * Saisissez attentivement votre adresse mail dans le champ prévu. 
    * Assurez-vous de ne pas faire d’erreur dans la saisie, car cette adresse est utilisée pour vous diriger automatiquement vers votre Portail d'authentification.

    Si votre adresse mail est correctement saisie, vous serez redirigé(e) vers Portail d'authentification de France Travail « Neptune » pour finaliser votre connexion.

    Bien cordialement,
    L’équipe ProConnect.
  `;
}
