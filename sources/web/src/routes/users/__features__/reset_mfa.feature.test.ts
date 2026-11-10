import { empty_databases, start_app, stop_app } from "#src/testing";
import { hyyyper_pglite } from "@~/hyyyperbase/testing";
import { insert_moderateur } from "@~/hyyyperbase/testing/users";
import { insert_database } from "@~/identite-proconnect/database/seed/insert";
import { pg } from "@~/identite-proconnect/database/testing";
import { afterAll, beforeAll } from "bun:test";
import { Scenario } from "buncept";

//

beforeAll(start_app);
beforeAll(async () => {
  await empty_databases();
  await insert_database(pg);
  await insert_moderateur(hyyyper_pglite);
});
afterAll(stop_app);

//

Scenario(
  "Le modérateur réinitialise la MFA et la voit dans le journal d'activité de l'utilisateur",
  ({ I }) => {
    I.amAcceptingPopups();

    I.amOnPage("/users");
    I.click({
      role: "link",
      name: "Utilisateur Raphael Dubigny (rdubigny@alpha.gouv.fr)",
    });
    I.see("Passkey - 1Password");
    I.see("🕓 3 activités de Raphael");

    I.click("📵 réinitialiser la MFA");

    I.see("L'utilisateur n'a pas de MFA configurée.");
    I.dontSee("Passkey - 1Password");
    I.click("🕓 4 activités de Raphael");
    I.within("~Activité user.mfa_reset", () => {
      I.see("Double authentification réinitialisée");
      I.see("moderateur@beta.gouv.fr");
    });
  },
);
