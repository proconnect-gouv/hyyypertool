import { setup_scenarios } from "#src/testing";
import { Scenario } from "buncept";

//

setup_scenarios();

//

Scenario(
  "Moderator can accept a blocking moderation with the toolbar",
  ({ I }) => {
    I.amOnPage("/moderations");
    I.seeTitleEquals("Liste des moderations");
    I.click("Modération a traiter de Jean Bon pour 13002526500013");

    I.seeTitleEquals("Modération a traiter de Jean Bon pour 13002526500013");
    I.see("jeanbon@yopmail.com");

    I.click("✅ Accepter");
    I.see(
      "A propos de jeanbon@yopmail.com pour l'organisation Direction interministerielle du numerique (DINUM), je valide :",
    );
    I.within("la modale de validation", () => {
      I.click("Terminer");
    });
    I.click("Annuler");

    I.see("Modération acceptée");
    I.see("Cette modération a été marqué comme traitée le");
    I.see("Validé par moderateur@beta.gouv.fr");

    I.click("Moderations");
    I.seeTitleEquals("Liste des moderations");
    I.dontSee("13002526500013");

    I.fillField("Filtrer les modérations…", "is:processed");
    I.pressKey("Enter");
    I.click("Modération a traiter de Jean Bon pour 13002526500013");

    I.seeTitleEquals("Modération a traiter de Jean Bon pour 13002526500013");
  },
);
