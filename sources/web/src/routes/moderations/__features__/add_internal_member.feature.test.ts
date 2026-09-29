import { setup_scenarios } from "#src/testing";
import { Scenario, type Actor } from "buncept";

//

setup_scenarios();

//

const MARIE = "Modération non vérifié de Marie Bon pour 57206768400017";
const RAPHAEL = "Modération non vérifié de Raphael Dubigny pour 81403721400016";

// Cucumber's "Contexte": the steps both scenarios start with
function background(I: Actor) {
  I.amOnPage("/moderations");
  I.seeTitleEquals("Liste des moderations");
  I.click("Voir les 🔓 Non vérifié");
}

//

Scenario("Marie est un membre interne de l'organization", ({ I }) => {
  background(I);

  I.click(MARIE);
  I.seeTitleEquals(MARIE);

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
  I.click(MARIE);

  // Open already: the members list unfolds for 1 to 3 members
  I.see("👥 1 membre connu dans l’organisation");
  I.within({ row: "Marie" }, () => {
    I.see("Bon");
  });
});

Scenario(
  "Raphael est déjà membre de l'organisation mais sa modération peut être validée",
  ({ I }) => {
    background(I);

    I.click(RAPHAEL);
    I.seeTitleEquals(RAPHAEL);

    I.click("✅ Accepter");
    I.within("la modale de validation", () => {
      I.checkOption("Ajouter Raphael à l'organisation EN TANT QU'INTERNE");
      I.click("Terminer");
    });
    I.click("Retour immédiat");

    I.seeTitleEquals("Liste des moderations");
  },
);
