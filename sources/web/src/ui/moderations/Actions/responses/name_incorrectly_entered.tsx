//

import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { context } from "../context";

export const label =
  "Nom et/ou prénom mal renseignés - Modération non-bloquante";

export default function template() {
  const {
    moderation: {
      organization: { siret },
    },
  } = useContext(context);
  return dedent`
    Bonjour, 

    Votre nom et/ou prénom n'a pas été correctement renseigné.

    Les champs Nom et Prénom doivent correspondre à ceux d’une personne physique.

    Merci de bien vouloir corriger cela depuis la section « Vos informations personnelles » de votre compte ProConnect (anciennement : AgentConnect, MonComptePro).

    Pour se faire :

    - Accédez à votre compte ProConnect en cliquant sur le lien suivant : https://identite.proconnect.gouv.fr/users/personal-information,
    - Authentifiez-vous si cela vous est demandé par l'interface,
    - Corrigez votre prénom et votre nom,
    - Sélectionnez votre organisation (numéro SIRET : ${siret}) pour que notre équipe puisse valider à nouveau la création de votre compte.

    Sans cette correction, nous serons contraints de supprimer votre compte prochainement.

    Merci pour votre correction.
    Bien cordialement
    L’équipe ProConnect.
  `;
}
