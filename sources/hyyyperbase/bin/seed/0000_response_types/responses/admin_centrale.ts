//

import { dedent } from "ts-dedent";
import type { Values } from "../context";

export const label = "Agent - adresse e-mail départementale —> Admin centrale";

export default function template(values: Values) {
  const {
    moderation: {
      organization: { cached_libelle: organization_name },
      user: { email },
    },
  } = values;

  return dedent`
    Bonjour,

    Nous avons bien reçu votre demande de rattachement à l'organisation « ${organization_name} » sur ProConnect (anciennement : AgentConnect, MonComptePro).

    Votre adresse e-mail départementale : « ${email} » ne vous permet pas de rattacher votre compte utilisateur ProConnect à cette administration centrale.
    Nous vous invitons à créer votre compte utilisateur ProConnect à nouveau, en le rattachant à l'administration déconcentrée dans laquelle vous exercez.

    Bien cordialement,
    L’équipe ProConnect.
  `;
}

// @timestamps
export const created_at = new Date("2024-11-15T12:19:40+01:00");
export const updated_at = new Date("2026-02-05T16:37:36+01:00");
