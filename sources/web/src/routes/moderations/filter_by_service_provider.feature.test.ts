import { setup_scenarios } from "#src/testing";
import { Scenario, type Actor } from "buncept";

//

setup_scenarios();

//

const JEAN_BON = "~Modération a traiter de Jean Bon pour 13002526500013";
const EXCLUDE_ANNUAIRE = 'is:pending -service:"Annuaire des entreprises"';

// Cucumber's "Contexte": the steps both scenarios start with
function background(I: Actor) {
  I.amOnPage("/moderations");
  I.see("Liste des moderations");
}

//

Scenario(
  "Exclure un fournisseur de service masque les modérations associées",
  ({ I }) => {
    background(I);

    I.seeElement(JEAN_BON);
    I.fillField("Filtrer les modérations…", EXCLUDE_ANNUAIRE);
    I.pressKey("Enter");
    I.dontSeeElement(JEAN_BON);
  },
);

Scenario("Retirer un filtre réaffiche les modérations exclues", ({ I }) => {
  background(I);

  I.fillField("Filtrer les modérations…", EXCLUDE_ANNUAIRE);
  I.pressKey("Enter");
  I.dontSeeElement(JEAN_BON);
  I.fillField("Filtrer les modérations…", "is:pending");
  I.pressKey("Enter");
  I.seeElement(JEAN_BON);
});
