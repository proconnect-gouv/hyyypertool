//

import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { context } from "../context";

export const label =
  "Agent gendarmerie.gouv —> SCI, Association… intitulée Gendarmerie";

export default function template() {
  const {
    moderation: {
      organization: {
        cached_libelle: organization_name,
        siret,
        cached_libelle_categorie_juridique,
      },
    },
  } = useContext(context);

  return dedent`
    Bonjour,

    Nous avons bien reçu votre demande de rattachement à l'organisation « ${organization_name} » sur ProConnect (anciennement : AgentConnect, MonComptePro).

    Pour information, vous semblez avoir fait erreur sur l'organisation à laquelle vous souhaitez rattacher votre compte utilisateur ProConnect.
    L'organisation « ${organization_name} » enregistrée sous le SIRET ${siret} est une « ${cached_libelle_categorie_juridique} ». 
    Pour information, les numéros SIREN/SIRET des organisations publiques commencent obligatoirement par 1 ou 2 (source : définition de l'INSEE du Numéro SIREN). 
    Comme vous pouvez le constater, le SIRET de l’organisation que vous avez choisi ne correspond pas à une organisation publique. 
    Nous vous invitons donc à créer à nouveau votre compte utilisateur en le rattachant à l'organisation publique dont vous dépendez (ex : région de gendarmerie dont vous dépendez…).

    Nous restons à votre disposition pour tout complément d'information.

    Bien cordialement, 
    L’équipe ProConnect.
  `;
}
