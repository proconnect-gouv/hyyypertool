import { afterAll, beforeAll, expect, test } from "bun:test";
import { start_fixtures, stop_fixtures } from "./fixture_server";
import { Scenario, config, create_browser } from "./index";

//

beforeAll(start_fixtures);
afterAll(stop_fixtures);

//

Scenario("amAcceptingPopups answers yes to confirm()", ({ I }) => {
  I.amAcceptingPopups();
  I.amOnPage("/confirm");
  I.click("Delete");
  I.see("deleted");
});

Scenario("click reaches a hidden checkbox through its label", ({ I }) => {
  I.amOnPage("/pill");
  I.click({ role: "checkbox", name: "Domaines" });
  I.see("filtered");
});

Scenario("wait accepts a duration", ({ I }) => {
  I.amOnPage("/");
  I.wait(0);
  I.seeTitleEquals("Fixture");
});

Scenario("seeFocused follows the keyboard focus", ({ I }) => {
  I.amOnPage("/keyboard");
  I.pressKey("Tab");
  I.seeFocused("First");
  I.pressKey("Tab");
  I.seeFocused("Second");
});

Scenario("pressKeyUntilFocused tabs to the named element", ({ I }) => {
  I.amOnPage("/keyboard");
  I.pressKeyUntilFocused("Tab", "Second");
  I.seeFocused("Second");
});

test("click fails on an element another one is painted over", async () => {
  const view = new Bun.WebView({
    backend: { type: "chrome", argv: ["--no-sandbox"] },
  });
  const timeout = config.timeout;
  config.timeout = 500;
  try {
    const browser = create_browser(view);
    await browser.navigate(`${config.url}/covered`);
    await expect(browser.act("click", [], "Menu")).rejects.toThrow(
      /element covered by <a href=/,
    );
  } finally {
    config.timeout = timeout;
    view.close();
  }
});
