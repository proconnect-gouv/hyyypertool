import { empty_databases, start_app, stop_app } from "#src/testing";
import { hyyyper_pglite } from "@~/hyyyperbase/testing";
import { insert_moderateur } from "@~/hyyyperbase/testing/users";
import { insert_database } from "@~/identite-proconnect/database/seed/insert";
import { pg } from "@~/identite-proconnect/database/testing";
import { afterAll, beforeAll } from "bun:test";
import { Scenario } from "buncept";

//

beforeAll(start_app);
afterAll(stop_app);

//

Scenario("Marie est un membre interne de l'organization", ({ I }) => {
  beforeAll(async () => {
    await empty_databases();
    await insert_database(pg);
    await insert_moderateur(hyyyper_pglite);
  });

  I.amOnPage("/moderations");
  I.seeTitleEquals("Liste des moderations");
  I.click("Voir les 🔓 Non vérifié");

  I.click("Modération non vérifié de Marie Bon pour 57206768400017");
  I.seeTitleEquals("Modération non vérifié de Marie Bon pour 57206768400017");

  I.click("👥 0 membre connu dans l’organisation");

  I.click("✅ Accepter");
  I.within("la modale de validation", () => {
    I.checkOption("Ajouter Marie à l'organisation EN TANT QU'INTERNE");
    I.click("Terminer");
  });
  I.click("Retour immédiat");

  I.seeTitleEquals("Liste des moderations");
  I.fillField("Filtrer les modérations…", "is:processed");
  I.pressKey("Enter");
  I.click("Modération non vérifié de Marie Bon pour 57206768400017");

  // Open already: the members list unfolds for 1 to 3 members
  I.see("👥 1 membre connu dans l’organisation");
  I.within({ row: "Marie" }, () => {
    I.see("Bon");
  });
});

Scenario(
  "Raphael est déjà membre de l'organisation mais sa modération peut être validée",
  ({ I }) => {
    beforeAll(async () => {
      await empty_databases();
      await insert_database(pg);
      await insert_moderateur(hyyyper_pglite);
    });

    I.amOnPage("/moderations");
    I.seeTitleEquals("Liste des moderations");
    I.click("Voir les 🔓 Non vérifié");

    I.click("Modération non vérifié de Raphael Dubigny pour 81403721400016");
    I.seeTitleEquals(
      "Modération non vérifié de Raphael Dubigny pour 81403721400016",
    );

    I.click("✅ Accepter");
    I.within("la modale de validation", () => {
      I.checkOption("Ajouter Raphael à l'organisation EN TANT QU'INTERNE");
      I.click("Terminer");
    });
    I.click("Retour immédiat");

    I.seeTitleEquals("Liste des moderations");
  },
);
