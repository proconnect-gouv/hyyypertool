import { setup_scenarios } from "#src/testing";
import { Scenario } from "buncept";

//

setup_scenarios();

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
