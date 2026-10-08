import { setup_scenarios } from "#src/testing";
import { Scenario } from "buncept";

//

setup_scenarios();

//

Scenario("Navigation avant et arrière dans la liste", ({ I }) => {
  I.amOnPage("/users?page_size=1&page=7");
  I.click("Suivant");
  I.see("marie.bon@fr.bosch.com");
  I.seeInCurrentUrl("page=8");
  I.click("Précédent");
  I.dontSee("marie.bon@fr.bosch.com");
  I.seeInCurrentUrl("page=7");
});
