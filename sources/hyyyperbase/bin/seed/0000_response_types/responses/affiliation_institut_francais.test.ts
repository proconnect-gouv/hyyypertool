//

import { expect, test } from "bun:test";
import type { Values } from "../context";
import affiliation_institut_francais from "./affiliation_institut_francais";

//

test("Application for affiliation with the 'Institut Français' Foundation", async () => {
  const result = await affiliation_institut_francais({
    domain: "🦒",
    moderation: { organization: { cached_libelle: "🦄" } },
  } as Values);
  expect(result).toMatchInlineSnapshot(`
    "Bonjour,

    Nous avons bien reçu votre demande de rattachement à l'organisation « 🦄 » sur ProConnect.

    Votre adresse mail associée au nom de domaine d’un institut français « 🦒 » ne vous permet pas de rattacher votre compte ProConnect à l'organisation « 🦄 ».

    Veuillez créer à nouveau votre compte ProConnect en le rattachant à l'organisation suivante :

    - INSTITUT FRANCAIS
    - SIRET : 52971592200041.

    Bien cordialement,

    L’équipe ProConnect."
  `);
});
