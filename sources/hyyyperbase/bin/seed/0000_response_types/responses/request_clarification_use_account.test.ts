//

import { expect, test } from "bun:test";
import type { Values } from "../context";
import request_clarification_use_account from "./request_clarification_use_account";

//

test("Request for clarification regarding the use of the account ", () => {
  const result = request_clarification_use_account({
    moderation: { organization: { cached_libelle: "🦄" } },
  } as Values);
  expect(result).toMatchInlineSnapshot(`
    "Bonjour,

    Nous avons bien reçu votre demande de rattachement à l'organisation « 🦄 » sur ProConnect.

    Afin de donner suite à cette demande, nous avons besoin d'éléments complémentaires.
    Pourriez-vous nous préciser :

    Pour quelle raison demandez-vous la création d'un compte ProConnect ?

    À quel service souhaitez-vous accéder avec ce compte ?

    Dans l’attente de votre retour.
    Bien cordialement,
    L’équipe ProConnect."
  `);
});
