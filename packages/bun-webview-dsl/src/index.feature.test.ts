//

import { afterEach, describe, expect, it } from "bun:test";
import { create_actor, make_web_view_options } from "./index";

//

const HTML = `<!doctype html>
  <div id="page">
    <button>Outside Button</button>
    <div id="modal" aria-label="la modale de validation">
      <button>Inside Button</button>
      <button>Terminer</button>
      <a href="#" aria-label="Confirmer">Confirm</a>
      <input placeholder="Name" />
      <label>Email <input /></label>
      <span>Modal Content</span>
      <span>Hidden in scope</span>
      <div id="nested" aria-label="sous-section">
        <button>Deep Button</button>
        <span>Deep Content</span>
      </div>
    </div>
    <button id="hidden" style="display:none">Hidden Button</button>
    <button id="toggled">Toggled Button</button>
  </div>`;

let server: ReturnType<typeof Bun.serve>;
afterEach(() => server?.stop(true));

function create_test_server() {
  return Bun.serve({
    fetch() {
      return new Response(HTML, {
        headers: { "content-type": "text/html" },
      });
    },
  });
}

//

describe("within", () => {
  it("scopes click to elements inside the container by dialogue name", async () => {
    server = create_test_server();

    await using view = new Bun.WebView(make_web_view_options());
    const I = create_actor(view, `http://localhost:${server.port}`);
    await I.navigate("/");
    await I.see("Outside Button");

    const modal = I.within("la modale de validation");
    await modal.click("Inside Button");
    await modal.see("Modal Content");
  });

  it("scoped see only checks text inside the container", async () => {
    server = create_test_server();

    await using view = new Bun.WebView(make_web_view_options());
    const I = create_actor(view, `http://localhost:${server.port}`);
    await I.navigate("/");

    const modal = I.within("la modale de validation");
    await modal.see("Modal Content");
    await modal.not_see("Outside Button");
  });

  it("scoped click_link finds aria-label inside the container", async () => {
    server = create_test_server();

    await using view = new Bun.WebView(make_web_view_options());
    const I = create_actor(view, `http://localhost:${server.port}`);
    await I.navigate("/");

    const modal = I.within("la modale de validation");
    await modal.click_link("Confirmer");
  });

  it("scoped fill targets inputs inside the container", async () => {
    server = create_test_server();

    await using view = new Bun.WebView(make_web_view_options());
    const I = create_actor(view, `http://localhost:${server.port}`);
    await I.navigate("/");

    const modal = I.within("la modale de validation");
    await modal.fill("Name", "Ada");
  });

  it("unscoped actor is unaffected by within calls", async () => {
    server = create_test_server();

    await using view = new Bun.WebView(make_web_view_options());
    const I = create_actor(view, `http://localhost:${server.port}`);
    await I.navigate("/");

    const modal = I.within("la modale de validation");
    await modal.click("Inside Button");

    await I.see("Outside Button");
    await I.see("Modal Content");
  });

  it("nested within chains scopes correctly", async () => {
    server = create_test_server();

    await using view = new Bun.WebView(make_web_view_options());
    const I = create_actor(view, `http://localhost:${server.port}`);
    await I.navigate("/");

    const nested = I.within("la modale de validation").within("sous-section");
    await nested.click("Deep Button");
    await nested.see("Deep Content");
    await nested.not_see("Outside Button");
    await nested.not_see("Inside Button");
  });

  it("throws when dialogue name does not match any element", async () => {
    server = create_test_server();

    await using view = new Bun.WebView(make_web_view_options());
    const I = create_actor(view, `http://localhost:${server.port}`);
    await I.navigate("/");

    const missing = I.within("dialogue inexistant");
    await expect(missing.click("Anything")).rejects.toThrow("scope not found");
    await expect(missing.fill("Name", "x")).rejects.toThrow("scope not found");
  });
});

describe("within callback form (Scenario)", () => {
  it("scopes assertions inside a describe with a scope-found guard", async () => {
    server = Bun.serve({
      fetch() {
        return new Response(HTML, {
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      },
    });

    await using view = new Bun.WebView(make_web_view_options());
    const I = create_actor(view, `http://localhost:${server.port}`);
    await I.navigate("/");

    // The callback form wraps assertions in a describe-like block.
    // Here we verify the scoped actor inside the callback sees only modal content.
    const modal = I.within("la modale de validation");
    await modal.see("Modal Content");
    await modal.not_see("Outside Button");
  });

  it("resolver matches <details> by <summary> textContent (no aria-label needed)", async () => {
    const details_html = `<!doctype html>
      <details open>
        <summary><h3>🌐 1 domaine connu dans l'organisation</h3></summary>
        <div><span>yopmail.com</span></div>
      </details>
      <details open>
        <summary><h3>other section</h3></summary>
        <div><span>noise-should-not-leak</span></div>
      </details>`;
    server = Bun.serve({
      fetch() {
        return new Response(details_html, {
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      },
    });

    await using view = new Bun.WebView(make_web_view_options());
    const I = create_actor(view, `http://localhost:${server.port}`);
    await I.navigate("/");

    const scoped = I.within("🌐 1 domaine connu dans l'organisation");
    await scoped.see("yopmail.com");
    await scoped.not_see("noise-should-not-leak");
  });

  it("resolver throws structured diagnostic on scope miss", async () => {
    const html = `<!doctype html>
      <details open>
        <summary><h3>🌐 2 domaines connus</h3></summary>
      </details>`;
    server = Bun.serve({
      fetch() {
        return new Response(html, {
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      },
    });

    await using view = new Bun.WebView(make_web_view_options());
    const I = create_actor(view, `http://localhost:${server.port}`);
    await I.navigate("/");

    const scoped = I.within("🌐 1 domaine connu");
    await expect(scoped.see("anything")).rejects.toThrow("scope not found");
    await expect(scoped.see("anything")).rejects.toThrow("considered");
    await expect(scoped.see("anything")).rejects.toThrow(
      "🌐 2 domaines connus",
    );
  });
});

describe("fill_and_submit", () => {
  it("sets value and dispatches Enter keydown", async () => {
    server = Bun.serve({
      fetch() {
        return new Response(
          `<!doctype html>
            <input placeholder="Search" />
            <script>
              document
                .querySelector("input")
                .addEventListener("keydown", (e) => {
                  if (e.key === "Enter") document.title = "submitted";
                });
            </script>`,
          { headers: { "content-type": "text/html" } },
        );
      },
    });

    await using view = new Bun.WebView(make_web_view_options());
    const I = create_actor(view, `http://localhost:${server.port}`);
    await I.navigate("/");
    await I.fill_and_submit("Search", "foo");

    const value = (await view.evaluate(
      `document.querySelector('input').value`,
    )) as string;
    expect(value).toBe("foo");

    const title = (await view.evaluate(`document.title`)) as string;
    expect(title).toBe("submitted");
  });
});

describe("see_table", () => {
  it("passes when all expected rows are found in the table", async () => {
    server = Bun.serve({
      fetch() {
        return new Response(
          `<!doctype html>
            <h3 id="t1">My Table</h3>
            <table aria-describedby="t1">
              <tr>
                <td>Alice</td>
                <td>admin</td>
              </tr>
              <tr>
                <td>Bob</td>
                <td>user</td>
              </tr>
            </table>`,
          { headers: { "content-type": "text/html" } },
        );
      },
    });

    await using view = new Bun.WebView(make_web_view_options());
    const I = create_actor(view, `http://localhost:${server.port}`);
    await I.navigate("/");
    await I.see_table("My Table", [["Alice", "admin"], ["Bob"]]);
  });

  it("rejects when an expected row is not found", async () => {
    server = Bun.serve({
      fetch() {
        return new Response(
          `<!doctype html>
            <h3 id="t1">My Table</h3>
            <table aria-describedby="t1">
              <tr>
                <td>Alice</td>
                <td>admin</td>
              </tr>
              <tr>
                <td>Bob</td>
                <td>user</td>
              </tr>
            </table>`,
          { headers: { "content-type": "text/html" } },
        );
      },
    });

    await using view = new Bun.WebView(make_web_view_options());
    const I = create_actor(view, `http://localhost:${server.port}`);
    await I.navigate("/");
    await expect(I.see_table("My Table", [["Charlie"]])).rejects.toThrow(
      "Row not found in table",
    );
  }, 15_000);
});

describe("click_visible", () => {
  it("clicks a visible element by text", async () => {
    server = create_test_server();

    await using view = new Bun.WebView(make_web_view_options());
    const I = create_actor(view, `http://localhost:${server.port}`);
    await I.navigate("/");

    await I.click_visible("Toggled Button");
  });

  it("throws when matching element is hidden", async () => {
    server = create_test_server();

    await using view = new Bun.WebView(make_web_view_options());
    const I = create_actor(view, `http://localhost:${server.port}`);
    await I.navigate("/");

    await expect(I.click_visible("Hidden Button")).rejects.toThrow(
      "Timed out waiting to click visible",
    );
  }, 15_000);
});
