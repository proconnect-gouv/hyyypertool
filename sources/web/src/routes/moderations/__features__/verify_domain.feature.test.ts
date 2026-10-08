import { setup_scenarios } from "#src/testing";
import { Scenario } from "buncept";

//

setup_scenarios();

//

Scenario("Le nom de domaine est vérifié", ({ I }) => {
  I.amOnPage("/moderations");
  I.see("Liste des moderations");
  I.click("Voir les 🔓 Non vérifié");
  I.click("Modération non vérifié de Marie Bon pour 57206768400017");
  I.seeTitleEquals("Modération non vérifié de Marie Bon pour 57206768400017");

  I.click("🌐 0 domaine connu dans l’organisation");

  I.click("✅ Accepter");
  I.within("la modale de validation", () => {
    I.checkOption(
      "J'autorise le domaine fr.bosch.com en interne à l'organisation",
    );
    I.click("Terminer");
  });
  I.click("Retour immédiat");

  I.seeTitleEquals("Liste des moderations");
  I.fillField("Filtrer les modérations…", "is:processed");
  I.pressKey("Enter");
  I.click("Modération non vérifié de Marie Bon pour 57206768400017");

  I.click("🌐 1 domaine connu dans l’organisation");
  I.within({ row: "fr.bosch.com" }, () => {
    I.see("verified");
  });
});
