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

Scenario("Marie Bon à rejoindre l'organisation Bosch par erreur", ({ I }) => {
  I.amOnPage("/moderations");
  I.see("Liste des moderations");
  I.fillField("Filtrer les modérations…", "is:processed date:2011-11-12");
  I.pressKey("Enter");
  I.click("Modération non vérifié de Marie Bon pour 44023386400014");
  I.seeTitleEquals("Modération non vérifié de Marie Bon pour 44023386400014");

  I.see("Cette modération a été marqué comme traité");
  I.see(
    "Marie Bon a rejoint une organisation avec un domain non vérifié « Bosch rexroth d.s.i. »",
  );
  I.click("Retraiter");
  I.dontSee("Cette modération a été marqué comme traité");

  I.click("👥 0 membre connu dans l’organisation");
});
