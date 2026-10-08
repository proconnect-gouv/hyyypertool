import { setup_scenarios } from "#src/testing";
import { Scenario } from "buncept";

//

setup_scenarios();

//

Scenario(
  "Validation automatique des modérations similaires avec domaine yopmail.com en interne",
  ({ I }) => {
    I.amOnPage("/moderations");
    I.seeTitleEquals("Liste des moderations");
    I.see("Liste des moderations");
    I.click("Modération a traiter de Jean Bon pour 51935970700022");
    I.seeTitleEquals("Modération a traiter de Jean Bon pour 51935970700022");

    I.click("✅ Accepter");
    I.see(
      "A propos de jeanbon@yopmail.com pour l'organisation Abracadabra (ABRACADABRA), je valide :",
    );

    I.within("la modale de validation", () => {
      I.checkOption("Ajouter Jean à l'organisation EN TANT QU'INTERNE");
      I.checkOption(
        "J'autorise le domaine yopmail.com en interne à l'organisation",
      );
      I.click("Terminer");
    });
    I.click("Annuler");

    I.see("Cette modération a été marqué comme traitée le");
    I.see("Validé par moderateur@beta.gouv.fr");

    I.click("Moderations");
    I.seeTitleEquals("Liste des moderations");
    I.fillField("Filtrer les modérations…", "is:processed");
    I.pressKey("Enter");

    I.dontSee("Jean Bon");
    I.dontSee("Jean Dré");

    I.fillField(
      "Filtrer les modérations…",
      "is:processed siret:51935970700022",
    );
    I.pressKey("Enter");
    I.click("Modération a traiter de Jean Dré pour 51935970700022");
    I.seeTitleEquals("Modération a traiter de Jean Dré pour 51935970700022");
    I.see("Validation automatique - domaine vérifié");
  },
);

Scenario(
  "Validation automatique des modérations similaires avec domaine yopmail.com en externe",
  ({ I }) => {
    I.amOnPage("/moderations");
    I.seeTitleEquals("Liste des moderations");
    I.see("Liste des moderations");
    I.click("Modération a traiter de Jean Bon pour 51935970700022");
    I.seeTitleEquals("Modération a traiter de Jean Bon pour 51935970700022");

    I.click("✅ Accepter");
    I.see(
      "A propos de jeanbon@yopmail.com pour l'organisation Abracadabra (ABRACADABRA), je valide :",
    );

    I.within("la modale de validation", () => {
      I.checkOption("Ajouter Jean à l'organisation EN TANT QU'EXTERNE");
      I.checkOption(
        "J'autorise le domaine yopmail.com en externe à l'organisation",
      );
      I.click("Terminer");
    });
    I.click("Annuler");

    I.see("Cette modération a été marqué comme traitée le");
    I.see("Validé par moderateur@beta.gouv.fr");

    I.click("Moderations");
    I.seeTitleEquals("Liste des moderations");
    I.fillField("Filtrer les modérations…", "is:processed");
    I.pressKey("Enter");

    I.dontSee("Jean Bon");
    I.dontSee("Jean Dré");

    I.fillField(
      "Filtrer les modérations…",
      "is:processed siret:51935970700022",
    );
    I.pressKey("Enter");
    I.click("Modération a traiter de Jean Dré pour 51935970700022");
    I.seeTitleEquals("Modération a traiter de Jean Dré pour 51935970700022");
    I.see("Validation automatique - domaine externe vérifié");
  },
);
