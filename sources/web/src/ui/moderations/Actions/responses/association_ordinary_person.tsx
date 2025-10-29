//

import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { context } from "../context";

export const label =
  "Association avec effectif sans nom de domaine : Personne ordinaire - Non trouvée sur la liste des dirigeants";

export default function template() {
  const {
    moderation: {
      organization: { cached_libelle: organization_name },
    },
  } = useContext(context);

  return dedent`
    Bonjour,

    Nous avons bien reçu votre demande de rattachement à l'organisation « ${organization_name} » sur ProConnect (anciennement : AgentConnect, MonComptePro).

    Après consultation de la Déclaration de la liste des personnes chargées de l'administration de l’association : « ${organization_name} », nous constatons que votre nom n'y figure pas. 

    Nous ne pouvons donc pas valider votre création de compte ProConnect.
    Afin de donner suite à cette demande, pourriez-vous nous transmettre un justificatif permettant d’attester votre rôle (ex : président, trésorier, secrétaire etc.) au sein du bureau de cette association ?
    Si non, veuillez confier l’action que souhaitez réaliser à l’une des personnes chargées de l'administration de l’association.

    Bien cordialement, 
    L’équipe ProConnect.
  `;
}
