import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { context } from "../context";

export const label =
  "Agent hors enseignant : e-mail académique —> Min Edu Nat et Jeunesse";

export default function template() {
  const {
    moderation: {
      organization: { cached_libelle: organization_name },
      user: { email },
    },
  } = useContext(context);

  return dedent`
    Bonjour,

    Nous avons bien reçu votre demande de rattachement à l'organisation « ${organization_name} » sur ProConnect (anciennement : AgentConnect, MonComptePro).

    Votre adresse e-mail académique : « ${email} » ne vous permet pas de rattacher votre compte utilisateur MonComptePro au Ministère de l’Éducation Nationale et de la Jeunesse.

    En fonction de votre profession et de votre périmètre d’intervention, merci de bien vouloir créer votre compte à nouveau en le rattachant à l’une des organisations suivantes :

    - L’établissement scolaire dans lequel vous exercez,
    - La Direction des services départementaux de l'Éducation nationale de laquelle vous dépendez,
    - Le rectorat de votre Académie.

    Bien cordialement,
    L’équipe ProConnect.
  `;
}
