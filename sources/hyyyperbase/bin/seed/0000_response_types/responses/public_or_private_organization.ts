//

import { dedent } from "ts-dedent";
import type { Values } from "../context";

export const label = "Prestataires privés —> Organisation publique ou privée ";

export default function template(values: Values) {
  const {
    moderation: {
      organization: { cached_libelle: organization_name },
    },
  } = values;

  return dedent`
    Bonjour,

    Nous avons bien reçu votre demande de rattachement à l'organisation « ${organization_name} » sur ProConnect (anciennement : AgentConnect, MonComptePro).

    Si vous travaillez ou êtes mandaté par l'organisation « ${organization_name} », demandez-lui de vous attribuer une adresse e-mail spécifique pour les prestataires. Vous pourrez ainsi l'utiliser dans le cadre de votre mission.
    Autrement, si cela est possible, veuillez accéder au service souhaité sans passer par ProConnect.

    Bien cordialement,
    L’équipe ProConnect.
  `;
}

// @timestamps
export const created_at = new Date("2024-11-15T12:19:40+01:00");
export const updated_at = new Date("2026-02-05T16:37:36+01:00");
