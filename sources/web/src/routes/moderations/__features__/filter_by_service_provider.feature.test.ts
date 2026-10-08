import { setup_scenarios } from "#src/testing";
import { Scenario } from "buncept";

//

setup_scenarios();

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
