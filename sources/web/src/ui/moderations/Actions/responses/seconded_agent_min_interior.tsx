//

import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { context } from "../context";

export const label = "Agent détaché diplomatie.gouv —> Min de l’Intérieur";

export default function template() {
  const {
    moderation: {
      organization: { cached_libelle: organization_name },
    },
  } = useContext(context);

  return dedent`
    Bonjour,

    Nous avons bien reçu votre demande de rattachement à l'organisation « ${organization_name} » sur ProConnect (anciennement : AgentConnect, MonComptePro).

    Vous semblez être un Agent ayant été détaché dans une administration française à l'étranger. 
    Si tel est le cas, nous vous invitons à créer à nouveau votre compte utilisateur, en le rattachant à l'organisation dans laquelle vous avez été détaché.
    Ex : vous avez été détaché dans l'Ambassade de France en IRAK, veuillez rattacher votre compte à celle-ci.

    Vous trouverez le SIRET de l'administration dans laquelle vous avez été détaché, sur l’Annuaire des Entreprises : https://annuaire-entreprises.data.gouv.fr/.

    Bien cordialement,
    L’équipe ProConnect.
  `;
}
