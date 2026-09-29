import { afterAll, beforeAll, expect, test } from "bun:test";
import { Scenario, config, create_browser } from "./index";

//

let server: ReturnType<typeof Bun.serve>;
beforeAll(() => {
  server = Bun.serve({
    port: 0,
    fetch: async ({ url }) => {
      const { pathname } = new URL(url);
      // A slow page whose button handler comes from a slower script: a
      // navigating click settles on the old page, and the button is visible
      // before its handler exists
      if (pathname === "/slow") {
        await Bun.sleep(200);
        return html(
          `<title>Slow</title><button id="handle">Handle</button><p id="out"></p>
          <script type="module" src="/slow.js"></script>`,
        );
      }
      if (pathname === "/slow.js") {
        await Bun.sleep(500);
        return new Response(
          `handle.addEventListener("click", () => (out.textContent = "handled"));`,
          { headers: { "content-type": "text/javascript" } },
        );
      }
      // Navigates a beat after the click, so settle() reliably checks the
      // old page, as a plain link does now and then under load
      if (pathname === "/nav")
        return html(
          `<button onclick="setTimeout(() => (location.href = '/slow'), 50)">Go slow</button>`,
        );
      return html(
        `<title>Fixture</title>
        <label for="email">Email</label><input id="email">
        <input placeholder="Filtrer…">
        <table>
          <tr><td>Richard</td><td><button onclick="this.textContent='done'">Menu</button></td></tr>
          <tr><td>Raphael</td><td><button>Menu</button></td></tr>
        </table>
        <details><summary>👥 2 membres</summary><p>Marie</p></details>
        <a aria-label="Open Richard" href="#richard">→</a>
        <label><input type="checkbox" id="notify"> Notify Jean</label>
        <p id="notified"></p>
        <script>
          // The first click is lost, like one landing before hydration
          let lost = false;
          notify.addEventListener("change", () => {
            if (!lost) return (lost = true), (notify.checked = false);
            notified.textContent = notify.checked ? "notify on" : "";
          });
        </script>`,
      );
    },
  });
  config.url = `http://localhost:${server.port}`;
});
afterAll(() => server.stop(true));

const html = (body: string) =>
  new Response(`<!doctype html>${body}`, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });

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
  I.click("Open Richard");
  I.seeInCurrentUrl("#richard");
  I.seeTitleEquals("Fixture");
});

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
