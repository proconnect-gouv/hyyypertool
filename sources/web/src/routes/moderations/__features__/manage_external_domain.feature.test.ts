import { setup_scenarios } from "#src/testing";
import { Scenario } from "buncept";

//

setup_scenarios();

//

const JEAN = "Modération a traiter de Jean Bon pour 51935970700022";

Scenario("Domaine externe", ({ I }) => {
  I.amOnPage("/moderations");
  I.see("Liste des moderations");
  I.click(JEAN);
  I.seeTitleEquals(JEAN);
  I.click("🌐 1 domaine connu dans l’organisation");

  I.within("~Domaine yopmail.com (not_verified_yet)", () => {
    I.see("yopmail.com");
  });

  I.click("Menu");
  I.click("❎ Domaine externe");

  I.within("~Domaine yopmail.com (external)", () => {
    I.see("❎");
  });
});
