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
  "Le modérateur voit qui a autorisé puis refusé le domaine yeswehack.com",
  ({ I }) => {
    I.amOnPage("/organizations/domains");
    I.click({
      role: "link",
      name: "Domaine non vérifié yeswehack.com pour Yes we hack",
    });
    I.see("« Yes we hack »");

    I.click("🕓 Historique des domaines");
    I.see("Aucun historique.");

    I.click("Menu");
    I.click("✅ Domaine autorisé");
    I.within("~Activité domain.verified", () => {
      I.see("moderateur@beta.gouv.fr");
      I.see("✅ Domaine yeswehack.com vérifié (verified)");
    });

    I.click("Menu");
    I.click("🚫 Domaine refusé");
    I.within("~Activité domain.refused", () => {
      I.see("moderateur@beta.gouv.fr");
      I.see("🚫 Domaine yeswehack.com refusé");
    });
    I.seeElement("~Activité domain.verified");
  },
);
