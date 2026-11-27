declare global {
  interface Window {
    __buncept_inflight?: number;
    __buncept_inflight_installed?: boolean;
  }
}

const count_inflight = (delta: number) => {
  window.__buncept_inflight = (window.__buncept_inflight ?? 0) + delta;
};

export function install_inflight() {
  if (window.__buncept_inflight_installed) return;
  window.__buncept_inflight_installed = true;
  window.__buncept_inflight = 0;
  const fetch = window.fetch;
  window.fetch = (...args: Parameters<typeof fetch>) => {
    count_inflight(1);
    return fetch.apply(window, args).finally(() => count_inflight(-1));
  };
  const send = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function (
    this: XMLHttpRequest,
    ...args: Parameters<typeof send>
  ) {
    count_inflight(1);
    this.addEventListener("loadend", () => count_inflight(-1));
    return send.apply(this, args);
  };
}

// Every action first waits for the current document to be fully loaded with
// no request in flight. A navigating click's settle() can run against the
// old, already-complete page and return at once; the next action then lands
// while the new page's scripts are still loading, before they attach their
// handlers, and is lost.
// ponytail: a handler attached by a dynamic import() after load is not
// covered; wait on that import too if a page needs it.
export function loaded() {
  return (
    document.readyState === "complete" &&
    !((window.__buncept_inflight ?? 0) > 0)
  );
}
