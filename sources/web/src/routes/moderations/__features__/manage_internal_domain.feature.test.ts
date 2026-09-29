import { setup_scenarios } from "#src/testing";
import { Scenario } from "buncept";

//

setup_scenarios();

//

const JEAN = "Modération a traiter de Jean Bon pour 51935970700022";

Scenario("Domaine interne", ({ I }) => {
  I.amOnPage("/moderations");
  I.see("Liste des moderations");
  I.click(JEAN);
  I.seeTitleEquals(JEAN);
  I.click("🌐 1 domaine connu dans l’organisation");

  I.within("~Domaine yopmail.com (not_verified_yet)", () => {
    I.see("❓");
    I.click("Menu");
    I.click("✅ Domaine autorisé");
  });

  I.within("~Domaine yopmail.com (verified)", () => {
    I.see("✅");
    I.click("Menu");
    I.click("🚫 Domaine refusé");
  });

  I.within("~Domaine yopmail.com (refused)", () => {
    I.see("🚫");
  });

  I.fillField("Ajouter un domain", "poymail.com");
  I.pressKey("Enter");

  I.see("poymail.com");
  I.within("~Domaine poymail.com (verified)", () => {
    I.see("✅");
  });
});
