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
  "Le modérateur voit la promotion d'un membre dans le journal d'activité de l'utilisateur",
  ({ I }) => {
    I.amAcceptingPopups();

    I.amOnPage("/users");
    I.click({
      role: "link",
      name: "Utilisateur Jean Dupont (jean@yeswehack.com)",
    });
    I.see("🕓 0 activité de Jean");

    I.amOnPage("/organizations/domains");
    I.click({
      role: "link",
      name: "Domaine non vérifié yeswehack.com pour Yes we hack",
    });
    I.click("Menu");
    I.click("✅ Domaine autorisé");

    I.amOnPage("/users");
    I.click({
      role: "link",
      name: "Utilisateur Jean Dupont (jean@yeswehack.com)",
    });
    I.click("🕓 1 activité de Jean");
    I.within("~Activité member.promoted", () => {
      I.see("Yes we hack");
      I.see("⬆️ Membre promu (domain_not_verified_yet → domain)");
      I.see("✅ Domaine yeswehack.com vérifié (verified)");
      I.see("moderateur@beta.gouv.fr");
    });
  },
);
