//

import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { context } from "../context";

export const label = "Agent Min des Armées —> SCI, Association… intitulée DGA";

export default function template() {
  const {
    moderation: {
      organization: { cached_libelle: organization_name, siret },
    },
  } = useContext(context);

  return dedent`
    Bonjour,

    Nous avons bien reçu votre demande de rattachement à l'organisation « ${organization_name} » sur ProConnect (anciennement : AgentConnect, MonComptePro).

    Pour information, vous semblez faire erreur sur l'organisation à laquelle vous souhaitez rattacher votre compte utilisateur ProConnect.
    En effet, l'organisation que vous avez choisie correspondant au SIRET « ${siret} », est une Association.
    Pour information, les numéros SIREN/SIRET des organisations publiques commencent obligatoirement par le chiffre 1 ou le chiffre 2 (source : définition de l'INSEE du Numéro SIREN).
    Selon nos recherches, la DIRECTION GÉNÉRALE DE L'ARMEMENT (DGA) n'apparaît pas dans le répertoire SIRENE, soit parce qu'elle n'est pas inscrite, soit parce qu'elle a choisi de ne pas diffuser ses informations en raison de la nature sensible de ses activités.

    Dans ce contexte, veuillez créer votre compte à nouveau en le rattachant au MINISTERE DES ARMEES : https://annuaire-entreprises.data.gouv.fr/entreprise/ministere-des-armees-110090016.

    Bien cordialement, 
    L’équipe ProConnect.
  `;
}
