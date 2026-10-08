import { setup_scenarios } from "#src/testing";
import { Scenario, type Actor } from "buncept";

//

setup_scenarios();

//

// Cucumber's "Contexte": the steps every scenario starts with
function background(I: Actor) {
  I.amOnPage("/moderations");
  I.click("Modération a traiter de Jean Bon pour 13002526500013");
  I.seeTitleEquals("Modération a traiter de Jean Bon pour 13002526500013");
}

//

Scenario("Le modérateur peut voir les détails de l'utilisateur", ({ I }) => {
  background(I);
  I.see("jeanbon@yopmail.com");
});

Scenario(
  "Le modérateur peut voir les organisations de l'utilisateur",
  ({ I }) => {
    background(I);
    I.see("organisation connu");
  },
);

Scenario(
  "Le modérateur peut voir les membres de l'organisation cible",
  ({ I }) => {
    background(I);
    I.see("membre connu");
  },
);

Scenario("Le modérateur peut revenir à la liste", ({ I }) => {
  background(I);
  I.click("retour");
  I.seeTitleEquals("Liste des moderations");
});
