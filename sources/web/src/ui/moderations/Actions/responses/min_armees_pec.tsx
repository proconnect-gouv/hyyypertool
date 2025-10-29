//

import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { context } from "../context";

export const label = "Agent Min des Armées - Pole d excellence cyber (PEC)";

export default function template() {
  const {
    moderation: {
      organization: { cached_libelle: organization_name, siret },
    },
  } = useContext(context);

  return dedent`
    Bonjour,

    Nous avons bien reçu votre demande de rattachement à l'organisation « ${organization_name} » sur ProConnect (anciennement : AgentConnect, MonComptePro).

    En rattachant votre compte utilisateur MonComptePro au « ${organization_name} », sachez que vous ne serez pas d'identifier comme étant un Agent, car cette organisation est enregistrée en tant qu'Association, sous le SIRET « ${siret} ».

    Pour information, les numéros SIREN/SIRET des organisations publiques commencent obligatoirement par le chiffre 1 ou le chiffre 2 (source : définition de l'INSEE du Numéro SIREN).

    Si vous créez votre compte utilisateur MonComptePro dans le but de pouvoir vous authentifier via AgentConnect, veuillez créer votre compte à nouveau en le rattachant à une autre organisation publique dont vous dépendez, ou au MINISTERE DES ARMEES : https://annuaire-entreprises.data.gouv.fr/entreprise/ministere-des-armees-110090016.

    Bien cordialement, 
    L’équipe ProConnect.
  `;
}
