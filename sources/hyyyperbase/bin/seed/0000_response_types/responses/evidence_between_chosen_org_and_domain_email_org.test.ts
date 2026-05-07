//

import { expect, test } from "bun:test";
import type { Values } from "../context";
import evidence_between_chosen_org_and_domain_email_org from "./evidence_between_chosen_org_and_domain_email_org";

//

test("Request for evidence of the link between the chosen organisation and the organisation associated with the email domain", async () => {
  const result = await evidence_between_chosen_org_and_domain_email_org({
    domain: "🦒",
    moderation: { organization: { cached_libelle: "🦄" } },
  } as Values);
  expect(result).toMatchInlineSnapshot(`
    "Bonjour,

    Nous avons bien reçu votre demande de rattachement à l'organisation « 🦄 » sur ProConnect.

    Le nom de domaine de votre adresse mail : « 🦒 » ne nous permet pas d’établir un lien entre vous et l’organisation « 🦄 ».
    Afin de donner suite à votre demande, pourriez-vous nous transmettre un justificatif légal (type KBIS ou autre) attestant du lien entre l’organisation « 🦄 » et celle correspondant à votre nom de domaine ?

    Bien cordialement,
    L’équipe ProConnect."
  `);
});
