import { afterAll, beforeAll, expect, test } from "bun:test";
import { start_fixtures, stop_fixtures } from "./fixture_server";
import { Scenario, config, create_browser } from "./index";

//

beforeAll(start_fixtures);
afterAll(stop_fixtures);

//

Scenario("checkOption clicks again until the option stays checked", ({ I }) => {
  I.amOnPage("/");
  I.dontSee("notify on");
  I.checkOption("Notify Jean");
  I.see("notify on");
});

Scenario(
  "an action after a navigating click waits for the new page",
  ({ I }) => {
    I.amOnPage("/nav");
    I.click("Go slow");
    I.click("Handle");
    I.see("handled");
  },
);

test("concurrent calls to the view are serialized", async () => {
  const view = new Bun.WebView(
    process.platform === "linux"
      ? { backend: { type: "chrome", argv: ["--no-sandbox"] } }
      : {},
  );
  try {
    const browser = create_browser(view);
    await browser.navigate(config.url);
    // Bun.WebView alone rejects an evaluate() while another is pending
    const titles = await Promise.all(
      Array.from({ length: 5 }, () =>
        browser.until(
          "no title",
          (title) => title === "Fixture",
          "document.title",
        ),
      ),
    );
    expect(titles).toHaveLength(5);
  } finally {
    view.close();
  }
});
