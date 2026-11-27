import { afterAll, beforeAll } from "bun:test";
import { start_fixtures, stop_fixtures } from "./fixture_server";
import { Scenario } from "./index";

//

beforeAll(start_fixtures);
afterAll(stop_fixtures);

//

Scenario("locators resolve the way a user reads the page", ({ I }) => {
  I.amOnPage("/");
  I.fillField("Email", "jean@bon.fr");
  I.fillField("Filtrer…", "is:pending");
  I.within({ row: "Richard" }, () => {
    I.click("Menu");
    I.see("done");
  });
  I.within({ row: "Raphael" }, () => {
    I.dontSee("done");
  });
  I.dontSee("Marie");
  I.click("👥 2 membres");
  I.see("Marie");
  I.seeElement("~Open Richard");
  I.dontSeeElement("~Open");
  I.seeElement({ role: "button", name: "Copier" });
  I.dontSeeElement({ role: "button", name: "Copi" });
  I.seeElement({ role: "link", name: "Open Richard" });
  I.click("Open Richard");
  I.seeInCurrentUrl("#richard");
  I.seeTitleEquals("Fixture");
});
