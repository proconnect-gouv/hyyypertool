import { config } from "./config";
import {
  actionable,
  check_in_page,
  covering,
  field_value,
  focused_in_page,
} from "./page/checks";
import { find } from "./page/find";
import { INFLIGHT_SHIM, LOADED } from "./page/loaded";
import type { Kind, Locator } from "./protocol";

//

const TRANSIENT = /navigated or closed|navigation is already pending/;
const PRESS_CAP = 50;

export type Browser = ReturnType<typeof create_browser>;

export function create_browser(view: Bun.WebView) {
  // Bun.WebView rejects concurrent calls ("an evaluate() is already
  // pending"), so every call to the view queues behind the previous one.
  let chain: Promise<unknown> = Promise.resolve();
  const serial = <T>(call: () => Promise<T>) => {
    const run = chain.then(call);
    chain = run.catch(() => {});
    return run;
  };
  const evaluate = <T>(script: string) =>
    serial(() => view.evaluate<T>(script));

  // Retries `read` until `done`, treating a page torn down by an in-flight
  // navigation as "not ready yet".
  async function until<T>(
    failure: string,
    done: (value: T) => boolean,
    script: string,
  ) {
    const deadline = Date.now() + config.timeout;
    let last: T | string = "not evaluated";
    for (;;) {
      try {
        last = await evaluate<T>(script);
        if (done(last as T)) return;
      } catch (error) {
        if (!TRANSIENT.test(String(error))) throw error;
      }
      if (Date.now() >= deadline)
        throw new Error(
          `${failure} after ${config.timeout}ms (got ${JSON.stringify(last)})`,
        );
      await Bun.sleep(100);
    }
  }

  let popup_stubs = "";

  // Waits for the element to be visible (and enabled), then runs `action`
  // on it in the same evaluate, so no swap can land between find and act.
  const act = (
    kind: Kind,
    scopes: Locator[],
    locator: Locator,
    action: (element: Element) => void,
  ) =>
    until<string>(
      `${JSON.stringify(locator)}`,
      (state) => state === "ok",
      `(() => {
        ${INFLIGHT_SHIM}
        ${popup_stubs}
        if (!(${LOADED})) return "page still loading";
        const element = (${find})(${JSON.stringify(kind)}, ${JSON.stringify(locator)}, ${JSON.stringify(scopes)});
        if (!element) return "element not found";
        if (!(${actionable})(element)) return "element not visible or not enabled";
        if (${JSON.stringify(kind)} === "click") {
          const cover = (${covering})(element);
          if (cover) return "element covered by " + cover;
        }
        (${action})(element);
        return "ok";
      })()`,
    );

  // The same wait as `act`, for actions that don't go through it.
  const ready = () =>
    until<boolean>(
      "page still loading",
      (loaded) => loaded === true,
      `(() => { ${INFLIGHT_SHIM}; ${popup_stubs} return ${LOADED}; })()`,
    );

  // htmx and islands use fetch/XHR: wait until none is in flight.
  // ponytail: best effort, never fails; assertions retry on their own.
  async function settle() {
    try {
      await until(
        "page not settled",
        (busy) => busy === false,
        `document.readyState !== "complete" || window.__buncept_inflight > 0`,
      );
    } catch {}
  }

  return {
    accept_popups() {
      popup_stubs = `window.confirm = () => true; window.alert = () => {};`;
    },
    act,
    wait(seconds: number) {
      return Bun.sleep(seconds * 1000);
    },
    // Clicks the option's label until the box stays checked: a click that
    // lands before its island hydrates is lost, so click again.
    async check(scopes: Locator[], field: Locator) {
      const deadline = Date.now() + config.timeout;
      const check = in_page(check_in_page, scopes, field);
      await ready();
      for (;;) {
        await until(
          `${JSON.stringify(field)} is not checked`,
          (checked) => checked === true,
          check,
        );
        // ponytail: same 150ms settle as fill, see there
        await Bun.sleep(150);
        if ((await evaluate(check)) === true) return;
        if (Date.now() >= deadline)
          throw new Error(`${JSON.stringify(field)} kept unchecking`);
      }
    },
    // Types over the current value like a user, then checks it held: an
    // island hydrating after the keystrokes resets the field, so retype.
    async fill(scopes: Locator[], field: Locator, value: string) {
      const deadline = Date.now() + config.timeout;
      const read = in_page(field_value, scopes, field);
      for (;;) {
        await act("field", scopes, field, (element) => {
          const input = element as HTMLInputElement;
          input.focus();
          input.click();
          input.select?.();
        });
        await serial(() => view.type(value));
        // ponytail: 150ms outlasts Preact's 100ms afterPaint fallback, the
        // latest an island's mount effect can reset the field.
        if ((await evaluate(read)) === value) {
          await Bun.sleep(150);
          if ((await evaluate(read)) === value) return;
        }
        if (Date.now() >= deadline)
          throw new Error(`field kept resetting, expected "${value}"`);
      }
    },
    async navigate(url: string) {
      const deadline = Date.now() + config.timeout;
      for (;;) {
        try {
          await serial(() => view.navigate(url));
          break;
        } catch (error) {
          if (!TRANSIENT.test(String(error)) || Date.now() >= deadline)
            throw error;
          await Bun.sleep(100);
        }
      }
      await settle();
    },
    async page_line() {
      try {
        const [url, title] = await evaluate<[string, string]>(
          "[location.href, document.title]",
        );
        return `Page: ${url} — "${title}"`;
      } catch {
        return "Page: unavailable";
      }
    },
    async press(key: string) {
      await ready();
      await serial(() => view.press(key));
    },
    // Presses `key` until focus lands on `locator`, as a user tabs through
    // a page; a cap keeps a wrong locator from cycling the page forever.
    async press_until_focused(
      scopes: Locator[],
      key: string,
      locator: Locator,
    ) {
      const focused = in_page(focused_in_page, scopes, locator);
      let last: unknown = null;
      for (let presses = 0; presses <= PRESS_CAP; presses++) {
        await ready();
        last = await evaluate(focused);
        if (last === true) return;
        if (presses < PRESS_CAP) await serial(() => view.press(key));
      }
      throw new Error(
        `${JSON.stringify(locator)} not focused after ${PRESS_CAP} presses of "${key}" (got ${JSON.stringify(last)})`,
      );
    },
    settle,
    until,
  };
}

//

export const in_page = (
  fn: (element: Element | null, ...args: string[]) => unknown,
  scopes: Locator[],
  locator: Locator,
) =>
  `(() => {
    const find = ${find};
    return (${fn})(find("text", null, ${JSON.stringify(scopes)}), ${JSON.stringify(locator)});
  })()`;
