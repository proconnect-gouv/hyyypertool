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
  "Exclure un fournisseur de service masque les modérations associées",
  ({ I }) => {
    I.amOnPage("/moderations");
    I.see("Liste des moderations");

    I.seeElement("~Modération a traiter de Jean Bon pour 13002526500013");
    I.fillField(
      "Filtrer les modérations…",
      'is:pending -service:"Annuaire des entreprises"',
    );
    I.pressKey("Enter");
    I.dontSeeElement("~Modération a traiter de Jean Bon pour 13002526500013");
  },
);

Scenario("Retirer un filtre réaffiche les modérations exclues", ({ I }) => {
  I.amOnPage("/moderations");
  I.see("Liste des moderations");

  I.fillField(
    "Filtrer les modérations…",
    'is:pending -service:"Annuaire des entreprises"',
  );
  I.pressKey("Enter");
  I.dontSeeElement("~Modération a traiter de Jean Bon pour 13002526500013");
  I.fillField("Filtrer les modérations…", "is:pending");
  I.pressKey("Enter");
  I.seeElement("~Modération a traiter de Jean Bon pour 13002526500013");
});
