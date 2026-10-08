import { setup_scenarios } from "#src/testing";
import { Scenario } from "buncept";

//

setup_scenarios();

//

Scenario("Navigation avant et arrière dans la liste", ({ I }) => {
  I.amOnPage("/organizations?page_size=1&page=4");
  I.see("Yes we hack");
  I.click("Suivant");
  I.see("Abracadabra (ABRACADABRA)");
  I.seeInCurrentUrl("page=5");
  I.click("Précédent");
  I.see("Yes we hack");
  I.seeInCurrentUrl("page=4");
});
