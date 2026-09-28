import { setup_scenarios } from "#src/testing";
import { Scenario } from "buncept";

//

setup_scenarios();

//

Scenario("Moderator can search a moderation by email", ({ I }) => {
  I.amOnPage("/moderations");
  I.see("Liste des moderations");
  I.see("Richard");

  I.fillField("Filtrer les modérations…", "is:pending email:jeanbon");
  I.pressKey("Enter");

  I.see("13002526500013");
  I.dontSee("Raphael");
});

Scenario("Moderator can search a moderation by SIRET", ({ I }) => {
  I.amOnPage("/moderations");
  I.see("Liste des moderations");
  I.see("Richard");

  I.fillField("Filtrer les modérations…", "is:pending siret:51935970700022");
  I.pressKey("Enter");

  I.see("51935970700022");
  I.dontSee("Raphael");
});

Scenario("Moderator can explore a moderation from the list", ({ I }) => {
  I.amOnPage("/moderations");
  I.see("Liste des moderations");
  I.see("Richard");

  I.click("Modération a traiter de Jean Bon pour 13002526500013");

  I.seeTitleEquals("Modération a traiter de Jean Bon pour 13002526500013");
  I.see("jeanbon@yopmail.com");
});
