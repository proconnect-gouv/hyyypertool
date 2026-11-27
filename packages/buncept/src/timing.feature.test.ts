import { afterAll, beforeAll, expect, test } from "bun:test";
import { start_fixtures, stop_fixtures } from "./fixture_server";
import { Scenario, call, config, create_browser } from "./index";

//

beforeAll(start_fixtures);
afterAll(stop_fixtures);

//

test("checkOption fails when the click on the option is lost", async () => {
  const view = new Bun.WebView({
    backend: { type: "chrome", argv: ["--no-sandbox"] },
  });
  const timeout = config.timeout;
  config.timeout = 500;
  try {
    const browser = await create_browser(view);
    await browser.navigate(config.url);
    await expect(browser.check([], "Notify Jean")).rejects.toThrow(
      /"Notify Jean" is not checked/,
    );
  } finally {
    config.timeout = timeout;
    view.close();
  }
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
  const view = new Bun.WebView({
    backend: { type: "chrome", argv: ["--no-sandbox"] },
  });
  try {
    const browser = await create_browser(view);
    await browser.navigate(config.url);
    // Bun.WebView alone rejects an evaluate() while another is pending
    const titles = await Promise.all(
      Array.from({ length: 5 }, () =>
        browser.until(
          "no title",
          (title) => title === "Fixture",
          call("title"),
        ),
      ),
    );
    expect(titles).toHaveLength(5);
  } finally {
    view.close();
  }
});
