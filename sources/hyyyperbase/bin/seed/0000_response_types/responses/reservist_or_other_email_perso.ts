//

import { dedent } from "ts-dedent";
import type { Values } from "../context";

export const label =
  "Réserviste ou autre - E-mail personnelle —> Admin publique (MI, DGPN, DGGN…)";

export default function template(values: Values) {
  const {
    moderation: {
      organization: { cached_libelle: organization_name },
    },
  } = values;

  return dedent`
    Bonjour,

    Nous avons bien reçu votre demande de rattachement à l'organisation « ${organization_name} » sur ProConnect (anciennement : AgentConnect, MonComptePro).

    Veuillez utiliser votre adresse e-mail professionnelle gouvernementale, associée au nom de domaine : « @interieur.gouv.fr » ou « @gendarmerie.interieur.gouv.fr ».
    Pour information, vous n'êtes pas autorisé à rattacher votre compte utilisateur à une administration publique avec une adresse e-mail personnelle.
    Si vous ne disposez pas d'une adresse e-mail professionnelle gouvernementale, veuillez accéder au service souhaité sans passer par ProConnect. 

    Bien cordialement,
    L’équipe ProConnect.
  `;
}
