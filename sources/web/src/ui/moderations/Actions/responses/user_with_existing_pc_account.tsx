//

import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { context } from "../context";

export const label = "Utilisateur possédant déjà un compte ProConnect";

export default async function template() {
  const {
    domain,
    moderation: {
      organization: { cached_libelle: organization_name, id: organization_id },
      user: { family_name },
    },
    query_suggest_same_user_emails,
  } = useContext(context);

  const members_email = await query_suggest_same_user_emails({
    family_name: family_name ?? "",
    organization_id: organization_id,
  });

  const possible_emails = list_possible_emails(members_email);

  return dedent`
    Bonjour,

    Nous avons bien reçu votre demande de rattachement à l'organisation « ${organization_name} » sur ProConnect (anciennement : AgentConnect, MonComptePro).

    ${possible_emails}

    Merci de bien vouloir vous connecter avec le compte déjà existant ou de le supprimer (nous pouvons le faire pour vous si vous répondez à ce message).

    Votre adresse e-mail associée à un nom de domaine gratuit tel que « ${domain} » ne sera pas autorisée.

    Bien cordialement,
    L’équipe ProConnect.
  `;
}

function list_possible_emails(emails: string[]) {
  if (emails.length === 0) {
    return dedent`
    Vous possédez déjà un compte ProConnect associé à l’adresse e-mail professionnelle : « ???? ».
    `;
  }

  if (emails.length === 1) {
    return dedent`
    Vous possédez déjà un compte ProConnect associé à l’adresse e-mail professionnelle : « ${emails[0]} ».
    `;
  }

  return dedent`
  Vous possédez déjà un compte ProConnect associé à l’adresse e-mail professionnelle :
    - ${emails.join("\n- ")}
  `;
}
