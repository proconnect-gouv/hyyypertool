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
  "Le modérateur filtre le journal d'activité par catégorie d'action",
  ({ I }) => {
    I.amOnPage("/organizations/domains");
    I.click({
      role: "link",
      name: "Domaine non vérifié yeswehack.com pour Yes we hack",
    });
    I.click("Menu");
    I.click("✅ Domaine autorisé");

    I.amOnPage("/activity");
    I.see("Liste des activités");
    I.see("✅ Domaine yeswehack.com vérifié (verified)");
    I.see("⬆️ Membre promu (domain_not_verified_yet → domain)");

    I.checkOption("Domaines");

    I.see("✅ Domaine yeswehack.com vérifié (verified)");
    I.dontSee("⬆️ Membre promu (domain_not_verified_yet → domain)");
  },
);
