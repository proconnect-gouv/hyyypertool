//

import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { context } from "../context";

export const label = "Agent hors Min Finances —> Chorus Pro";

export default function template() {
  const {
    moderation: {
      organization: { cached_libelle: organization_name },
    },
  } = useContext(context);

  return dedent`
    Bonjour,

    Nous avons bien reçu votre demande de rattachement à l'organisation « ${organization_name} » sur ProConnect (anciennement : AgentConnect, MonComptePro).

    Vous tentez de rattacher votre compte à l’organisation à laquelle sont facturés les achats de votre administration. 
    Il ne s’agit pas de l’organisation dans laquelle vous exercez.
    Pour information, seuls les Agents du Ministre de l'Économie et des Finances peuvent rattacher leur compte à cette administration.
    Veuillez créer votre compte à nouveau en le rattachant à l'Administration publique ou le Ministère dont vous dépendez.

    Bien cordialement,
    L’équipe ProConnect.
  `;
}
