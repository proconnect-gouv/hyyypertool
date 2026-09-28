import { afterAll, beforeAll, expect, test } from "bun:test";
import { Scenario, config, create_browser } from "./index";

//

let server: ReturnType<typeof Bun.serve>;
beforeAll(() => {
  server = Bun.serve({
    port: 0,
    fetch: () =>
      new Response(
        `<!doctype html><title>Fixture</title>
        <label for="email">Email</label><input id="email">
        <input placeholder="Filtrer…">
        <table>
          <tr><td>Richard</td><td><button onclick="this.textContent='done'">Menu</button></td></tr>
          <tr><td>Raphael</td><td><button>Menu</button></td></tr>
        </table>
        <details><summary>👥 2 membres</summary><p>Marie</p></details>
        <a aria-label="Open Richard" href="#richard">→</a>`,
        { headers: { "content-type": "text/html; charset=utf-8" } },
      ),
  });
  config.url = `http://localhost:${server.port}`;
});
afterAll(() => server.stop(true));

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
  I.click("Open Richard");
  I.seeInCurrentUrl("#richard");
  I.seeTitleEquals("Fixture");
});

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
