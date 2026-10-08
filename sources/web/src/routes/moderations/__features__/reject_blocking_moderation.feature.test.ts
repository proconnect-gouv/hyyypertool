import { setup_scenarios } from "#src/testing";
import { Scenario } from "buncept";

//

setup_scenarios();

//

Scenario("Le modérateur le refuse avec la barre d'outils", ({ I }) => {
  I.amOnPage("/moderations");
  I.see("Liste des moderations");
  I.fillField("Filtrer les modérations…", "is:pending date:2011-11-11");
  I.pressKey("Enter");
  I.click("Modération a traiter de Jean Bon pour 13002526500013");
  I.seeTitleEquals("Modération a traiter de Jean Bon pour 13002526500013");

  I.click("❌ Refuser");
  I.see("Motif de refus :");

  I.within("la modale de refus", () => {
    I.fillField("Recherche d'une réponse type", "Nom de domaine introuvable");
    I.pressKey("Enter");
    I.see(
      "⚠️ Attention, cette réponse type autorise l'utilisateur à éditer ses informations personnelles.",
    );
    I.see("Motif transmis à l'utilisateur :");

    I.click("Notifier et terminer");
  });

  I.click("Annuler");
  I.see("Modération rejetée");
  I.see("Cette modération a été marqué comme traitée le");

  I.click("Moderations");
  I.seeTitleEquals("Liste des moderations");
  I.see("Liste des moderations");
  I.dontSee("13002526500013");
});

Scenario(
  "Le warning ne s'affiche pas quand le template n'autorise pas l'édition",
  ({ I }) => {
    I.amOnPage("/moderations");
    I.see("Liste des moderations");
    I.fillField("Filtrer les modérations…", "is:pending date:2011-11-11");
    I.pressKey("Enter");
    I.click("Modération a traiter de Jean Bon pour 13002526500013");
    I.seeTitleEquals("Modération a traiter de Jean Bon pour 13002526500013");

    I.click("❌ Refuser");

    I.within("la modale de refus", () => {
      I.fillField(
        "Recherche d'une réponse type",
        "Agent - adresse e-mail départementale —> Admin centrale",
      );
      I.pressKey("Enter");
      I.dontSee(
        "⚠️ Attention, cette réponse type autorise l'utilisateur à éditer ses informations personnelles.",
      );
      I.see("Motif transmis à l'utilisateur :");
    });
  },
);
