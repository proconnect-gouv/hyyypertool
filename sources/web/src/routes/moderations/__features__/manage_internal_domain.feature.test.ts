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

Scenario("Domaine interne", ({ I }) => {
  I.amOnPage("/moderations");
  I.see("Liste des moderations");
  I.click("Modération a traiter de Jean Bon pour 51935970700022");
  I.seeTitleEquals("Modération a traiter de Jean Bon pour 51935970700022");
  I.click("🌐 1 domaine connu dans l’organisation");

  I.within("~Domaine yopmail.com (not_verified_yet)", () => {
    I.see("❓");
    I.click("Menu");
    I.click("✅ Domaine autorisé");
  });

  I.within("~Domaine yopmail.com (verified)", () => {
    I.see("✅");
    I.click("Menu");
    I.click("🚫 Domaine refusé");
  });

  I.within("~Domaine yopmail.com (refused)", () => {
    I.see("🚫");
  });

  I.fillField("Ajouter un domain", "poymail.com");
  I.pressKey("Enter");

  I.see("poymail.com");
  I.within("~Domaine poymail.com (verified)", () => {
    I.see("✅");
  });
});
