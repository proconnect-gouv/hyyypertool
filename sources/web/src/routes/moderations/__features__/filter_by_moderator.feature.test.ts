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
  "Filtrer par modérateur affiche les modérations traitées par ce modérateur",
  ({ I }) => {
    I.amOnPage("/moderations");
    I.see("Liste des moderations");

    I.dontSee("44023386400014");
    I.fillField("Filtrer les modérations…", "by:moderateur@beta.gouv.fr");
    I.pressKey("Enter");
    I.see("44023386400014");
  },
);

Scenario("Filtrer par un autre modérateur affiche ses modérations", ({ I }) => {
  I.amOnPage("/moderations");
  I.see("Liste des moderations");

  I.dontSeeElement(
    "~Modération non vérifié de Raphael Dubigny pour 13002526500013",
  );
  I.fillField("Filtrer les modérations…", "by:admin@beta.gouv.fr");
  I.pressKey("Enter");
  I.seeElement(
    "~Modération non vérifié de Raphael Dubigny pour 13002526500013",
  );
});
