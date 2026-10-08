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

Scenario("Le nom de domaine est vérifié", ({ I }) => {
  I.amOnPage("/moderations");
  I.see("Liste des moderations");
  I.click("Voir les 🔓 Non vérifié");
  I.click("Modération non vérifié de Marie Bon pour 57206768400017");
  I.seeTitleEquals("Modération non vérifié de Marie Bon pour 57206768400017");

  I.click("🌐 0 domaine connu dans l’organisation");

  I.click("✅ Accepter");
  I.within("la modale de validation", () => {
    I.checkOption(
      "J'autorise le domaine fr.bosch.com en interne à l'organisation",
    );
    I.click("Terminer");
  });
  I.click("Retour immédiat");

  I.seeTitleEquals("Liste des moderations");
  I.fillField("Filtrer les modérations…", "is:processed");
  I.pressKey("Enter");
  I.click("Modération non vérifié de Marie Bon pour 57206768400017");

  I.click("🌐 1 domaine connu dans l’organisation");
  I.within({ row: "fr.bosch.com" }, () => {
    I.see("verified");
  });
});
