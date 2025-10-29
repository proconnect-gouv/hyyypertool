//

import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { context } from "../context";

export const label = "Étudiant —> Etablissement scolaire ou de formation";

export default function template() {
  const {
    moderation: {
      organization: { cached_libelle: organization_name },
    },
  } = useContext(context);

  return dedent`
    Bonjour,

    Nous avons bien reçu votre demande de rattachement à l'organisation « ${organization_name} » sur ProConnect (anciennement : AgentConnect, MonComptePro).

    Nous sommes contraints de refuser votre demande de création de compte ProConnect.
    Pour information, les étudiants ne sont pas autorisés à se rattacher à leur établissement scolaire ou de formation sur ProConnect, car cela leur donnerait des droits d'accès à des services et démarches réservés uniquement aux Agents (ou employés) de l'établissement.
    Veuillez accéder au service souhaité en vous créant un compte, sans passer par ProConnect.

    Bien cordialement,
    L’équipe ProConnect.
  `;
}
