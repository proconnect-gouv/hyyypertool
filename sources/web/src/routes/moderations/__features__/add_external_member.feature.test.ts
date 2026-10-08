import { setup_scenarios } from "#src/testing";
import { Scenario } from "buncept";

//

setup_scenarios();

//

Scenario("Marie est un membre externe de l'organization", ({ I }) => {
  I.amOnPage("/moderations");
  I.seeTitleEquals("Liste des moderations");
  I.click("Voir les 🔓 Non vérifié");
  I.click("Modération non vérifié de Marie Bon pour 57206768400017");
  I.seeTitleEquals("Modération non vérifié de Marie Bon pour 57206768400017");

  I.click("👥 0 membre connu dans l’organisation");

  I.click("✅ Accepter");
  I.within("la modale de validation", () => {
    I.checkOption("Ajouter Marie à l'organisation EN TANT QU'EXTERNE");
    I.click("Terminer");
  });
  I.click("Retour immédiat");

  I.seeTitleEquals("Liste des moderations");
  I.fillField("Filtrer les modérations…", "is:processed");
  I.pressKey("Enter");
  I.click("Modération non vérifié de Marie Bon pour 57206768400017");

  // Open already: the members list unfolds for 1 to 3 members
  I.see("👥 1 membre connu dans l’organisation");
  I.within({ row: "marie.bon@fr.bosch.com" }, () => {
    I.see("Marie");
    I.see("Bon");
    I.see("❌");
    I.see("no_validation_means_available");
  });
});

Scenario(
  "Marie est validée en externe avec notification et ajout du domaine en externe",
  ({ I }) => {
    I.amOnPage("/moderations");
    I.seeTitleEquals("Liste des moderations");
    I.click("Voir les 🔓 Non vérifié");
    I.click("Modération non vérifié de Marie Bon pour 57206768400017");
    I.seeTitleEquals("Modération non vérifié de Marie Bon pour 57206768400017");

    I.click("👥 0 membre connu dans l’organisation");
    I.click("🌐 0 domaine connu dans l’organisation");

    I.click("✅ Accepter");
    I.within("la modale de validation", () => {
      I.checkOption("Ajouter Marie à l'organisation EN TANT QU'EXTERNE");
      I.checkOption(
        "J'autorise le domaine fr.bosch.com en externe à l'organisation",
      );
      I.checkOption(
        "Notifier marie.bon@fr.bosch.com du traitement de la modération.",
      );
      I.click("Terminer");
    });
    I.click("Retour immédiat");

    I.seeTitleEquals("Liste des moderations");
    I.fillField("Filtrer les modérations…", "is:processed");
    I.pressKey("Enter");
    I.click("Modération non vérifié de Marie Bon pour 57206768400017");

    // Open already: the members list unfolds for 1 to 3 members
    I.see("👥 1 membre connu dans l’organisation");
    I.within({ row: "marie.bon@fr.bosch.com" }, () => {
      I.see("Marie");
      I.see("❌");
      I.see("domain");
    });

    I.click("🌐 1 domaine connu dans l’organisation");
    I.within({ row: "external" }, () => {
      I.see("fr.bosch.com");
    });
  },
);
