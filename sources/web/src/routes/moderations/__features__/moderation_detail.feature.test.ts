import { setup_scenarios } from "#src/testing";
import { Scenario } from "buncept";

//

setup_scenarios();

//

Scenario("Le modérateur peut voir les détails de l'utilisateur", ({ I }) => {
  I.amOnPage("/moderations");
  I.click("Modération a traiter de Jean Bon pour 13002526500013");
  I.seeTitleEquals("Modération a traiter de Jean Bon pour 13002526500013");
  I.see("jeanbon@yopmail.com");
});

Scenario(
  "Le modérateur peut voir les organisations de l'utilisateur",
  ({ I }) => {
    I.amOnPage("/moderations");
    I.click("Modération a traiter de Jean Bon pour 13002526500013");
    I.seeTitleEquals("Modération a traiter de Jean Bon pour 13002526500013");
    I.see("organisation connu");
  },
);

Scenario(
  "Le modérateur peut voir les membres de l'organisation cible",
  ({ I }) => {
    I.amOnPage("/moderations");
    I.click("Modération a traiter de Jean Bon pour 13002526500013");
    I.seeTitleEquals("Modération a traiter de Jean Bon pour 13002526500013");
    I.see("membre connu");
  },
);

Scenario("Le modérateur peut revenir à la liste", ({ I }) => {
  I.amOnPage("/moderations");
  I.click("Modération a traiter de Jean Bon pour 13002526500013");
  I.seeTitleEquals("Modération a traiter de Jean Bon pour 13002526500013");
  I.click("retour");
  I.seeTitleEquals("Liste des moderations");
});
