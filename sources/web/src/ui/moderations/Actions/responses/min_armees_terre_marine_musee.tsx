//

import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { context } from "../context";

export const label =
  "Agent Min des Armées —> Terre armée, Marine nationale, Musée de la Marine";

export default function template() {
  const {
    moderation: {
      organization: {
        cached_libelle: organization_name,
        cached_libelle_categorie_juridique,
      },
    },
  } = useContext(context);

  return dedent`
    Bonjour,

    Nous avons bien reçu votre demande de rattachement à l'organisation « ${organization_name} » sur ProConnect (anciennement : AgentConnect, MonComptePro).

    Nous pensons que vous avez fait erreur sur l'organisation à laquelle vous souhaitez rattacher votre compte utilisateur ProConnect.
    L'organisation « ${organization_name} » est une organisation privée dont l'activité est la suivante : « ${cached_libelle_categorie_juridique} ».
    Ne souhaitiez-vous pas rattacher votre compte à XXXXXXX ?
    Si tel est le cas, d'après nos recherches, XXXXXXXX n'apparaît pas dans le répertoire SIRENE, soit parce qu'elle n'est pas inscrite, soit parce qu'elle a choisi de ne pas diffuser ses informations en raison de la nature sensible de ses activités.

    Dans ce contexte, veuillez renouveler votre création de compte en le rattachant au : 
    MINISTERE DES ARMEES : https://annuaire-entreprises.data.gouv.fr/entreprise/ministere-des-armees-110090016.

    Bien cordialement, 
    L’équipe ProConnect.
  `;
}
