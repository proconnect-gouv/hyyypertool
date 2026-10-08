import { setup_scenarios } from "#src/testing";
import { Scenario, type Actor } from "buncept";

//

setup_scenarios();

//

const RAPHAEL =
  "~Modération non vérifié de Raphael Dubigny pour 13002526500013";

// Cucumber's "Contexte": the steps both scenarios start with
function background(I: Actor) {
  I.amOnPage("/moderations");
  I.see("Liste des moderations");
}

//

Scenario(
  "Filtrer par modérateur affiche les modérations traitées par ce modérateur",
  ({ I }) => {
    background(I);

    I.dontSee("44023386400014");
    I.fillField("Filtrer les modérations…", "by:moderateur@beta.gouv.fr");
    I.pressKey("Enter");
    I.see("44023386400014");
  },
);

Scenario("Filtrer par un autre modérateur affiche ses modérations", ({ I }) => {
  background(I);

  I.dontSeeElement(RAPHAEL);
  I.fillField("Filtrer les modérations…", "by:admin@beta.gouv.fr");
  I.pressKey("Enter");
  I.seeElement(RAPHAEL);
});
