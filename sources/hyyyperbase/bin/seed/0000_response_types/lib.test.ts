//

import { describe, expect, setSystemTime, test } from "bun:test";
import { load_templates } from "./lib";

//

setSystemTime(new Date("2026-04-13T15:04:15.185Z"));
const response_files = await load_templates();

describe("seed:0000_response_types", () => {
  test("loads old 28 legacy response templates", async () => {
    expect(response_files).toHaveLength(30);
  });

  test("Agent France Travail - FI sur PCF", async () => {
    const agent_france_travail_fi_sur_pcf = response_files.at(0)!;

    expect(agent_france_travail_fi_sur_pcf.content).toMatchInlineSnapshot(`
      "Bonjour,

      Nous avons bien reçu votre demande de rattachement à l'organisation « \${ organization_name } » sur ProConnect (anciennement : AgentConnect, MonComptePro).

      Vous possédez déjà un compte ProConnect associé à l’adresse e-mail professionnelle : « \${ suggest_emails_associated_to_user } ».

      Merci de bien vouloir vous connecter avec le compte déjà existant ou de le supprimer (nous pouvons le faire pour vous si vous répondez à ce message).

      Votre adresse e-mail associée à un nom de domaine gratuit tel que « \${ domain } » ne sera pas autorisée.

      Bien cordialement,
      L’équipe ProConnect."
    `);
    expect(agent_france_travail_fi_sur_pcf.label).toMatchInlineSnapshot(`"Utilisateur possédant déjà un compte ProConnect"`);
  });
});
