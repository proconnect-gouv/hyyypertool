// Every action first waits for the current document to be fully loaded with
// no request in flight. A navigating click's settle() can run against the
// old, already-complete page and return at once; the next action then lands
// while the new page's scripts are still loading, before they attach their
// handlers, and is lost.
// ponytail: a handler attached by a dynamic import() after load is not
// covered; wait on that import too if a page needs it.
export const LOADED = `document.readyState === "complete" && !(window.__buncept_inflight > 0)`;

export const INFLIGHT_SHIM = `
  if (!window.__buncept_inflight_installed) {
    window.__buncept_inflight_installed = true;
    window.__buncept_inflight = 0;
    const fetch = window.fetch;
    window.fetch = function () {
      window.__buncept_inflight++;
      return fetch.apply(this, arguments).finally(() => window.__buncept_inflight--);
    };
    const send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function () {
      window.__buncept_inflight++;
      this.addEventListener("loadend", () => window.__buncept_inflight--);
      return send.apply(this, arguments);
    };
  }`;
