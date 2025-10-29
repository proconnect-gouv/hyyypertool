//

import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { context } from "../context";

export const label =
  "Association avec effectif sans nom de domaine : Auto-déclaré dirigeant - Non trouvé sur la liste des dirigeants";

export default function template() {
  const {
    moderation: {
      organization: { cached_libelle: organization_name },
    },
  } = useContext(context);

  return dedent`
    Bonjour,

    Nous avons bien reçu votre demande de rattachement à l'organisation « ${organization_name} » sur ProConnect (anciennement : AgentConnect, MonComptePro).

    Vous indiquez être le dirigeant/ président de l’association « ${organization_name} ».
    Or, après consultation de la Déclaration de la liste des personnes chargées de l'administration de l'association, nous constatons que votre nom n'y figure pas.
    Afin de donner suite à cette demande, pourriez-vous nous transmettre un justificatif permettant d’attester votre position de dirigeant/ président de l’association ? 

    Dans l'attente de votre retour,
    Bien cordialement
    L’équipe ProConnect.
  `;
}
