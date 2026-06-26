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
