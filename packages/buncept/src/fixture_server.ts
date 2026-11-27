import { config } from "./index";

//

let server: ReturnType<typeof Bun.serve>;

export function start_fixtures() {
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
      if (pathname === "/keyboard")
        return html(`<a href="#first">First</a> <a href="#second">Second</a>`);
      if (pathname === "/confirm")
        return html(
          `<button onclick="out.textContent = confirm('Sure?') ? 'deleted' : 'kept'">Delete</button><p id="out"></p>`,
        );
      // A row-wide link painted over the row's button, as a stretched
      // `after:absolute after:inset-0` link does
      if (pathname === "/covered")
        return html(
          `<table><tr style="position: relative">
            <td><button onclick="out.textContent = 'opened'">Menu</button></td>
            <td><a href="#row" style="position: absolute; inset: 0">Row</a></td>
          </tr></table><p id="out"></p>`,
        );
      // A pill: the checkbox is visually hidden and the user clicks its label
      if (pathname === "/pill")
        return html(
          `<label style="display: inline-block; padding: 8px">
            <input type="checkbox" aria-label="Domaines" onchange="out.textContent = 'filtered'"
              style="position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0)">
            Domaines
          </label><p id="out"></p>`,
        );
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
        <button title="Copier"><svg aria-hidden="true"></svg></button>
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
}

export function stop_fixtures() {
  server.stop(true);
}

const html = (body: string) =>
  new Response(`<!doctype html>${body}`, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
