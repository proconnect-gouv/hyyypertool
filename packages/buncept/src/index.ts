// Parts of this file (actionability check, click dispatched in-page, fill by
// focus + select + type-over, retry on "navigated or closed") are adapted
// from bunwright 0.3.2 and the local patch this repo carried on it (removed):
//
//   Bunwright: The lightweight browser automation library for Bun
//   Copyright (C) Jonas Perusquia Morales
//   Licensed under the GNU Lesser General Public License v2.1
//   https://github.com/jonaspm/bunwright
//
// Modified for hyyypertool: rewritten as a CodeceptJS-style `I` actor over
// Bun.WebView, relicensed under the GPL-3.0 as LGPL-2.1 §3 allows.

import { afterAll, beforeAll, describe, expect, test } from "bun:test";

//

// CodeceptJS locators — https://codecept.io/locators/
// A string is matched the way a user reads the page; objects are strict.
export type Locator =
  string | { css: string } | { role: string; name?: string } | { row: string };

export const config: {
  url: string;
  timeout: number;
} = { url: "", timeout: 10_000 };

export type Actor = ReturnType<typeof create_actor>;

// https://codecept.io/basics/#writing-tests
export function Scenario(title: string, body: (context: { I: Actor }) => void) {
  describe.serial(title, () => {
    const scenario = {} as Parameters<typeof create_actor>[0];
    let view: Bun.WebView | undefined;
    beforeAll(async () => {
      view = new Bun.WebView(
        process.platform === "linux"
          ? {
              backend: {
                type: "chrome",
                argv: [
                  "--no-sandbox",
                  `--user-data-dir=/tmp/buncept-${crypto.randomUUID()}`,
                ],
              },
            }
          : {},
      );
      scenario.browser = create_browser(view);
    });
    afterAll(() => view?.close());
    body({ I: create_actor(scenario) });
  });
}

//

type Browser = ReturnType<typeof create_browser>;

// Each step is its own test, so the bun reporter prints the step log: a
// test reads as a list of sentences, with no `await`.
function create_actor(scenario: { browser: Browser; failed_step?: string }) {
  let scopes: Locator[] = [];
  const step = <A extends unknown[]>(
    name: string,
    run: (browser: Browser, scopes: Locator[], ...args: A) => Promise<void>,
  ) =>
    function call(...args: A) {
      // Re-point failures at the test line that called the step
      const site = new Error();
      Error.captureStackTrace(site, call);
      const label = `I ${name} ${args.map((arg) => JSON.stringify(arg)).join(", ")}`;
      const step_scopes = scopes;
      test(label, async () => {
        // ponytail: bun 1.4.2 has no runtime skip, so steps after a failure
        // fail as "skipped"; use it once bun ships one
        if (scenario.failed_step)
          return expect().fail(
            `skipped: step "${scenario.failed_step}" failed`,
          );
        try {
          await run(scenario.browser, step_scopes, ...args);
        } catch (error) {
          scenario.failed_step = label;
          const reason = error instanceof Error ? error.message : String(error);
          site.message = `${label}\n${reason}\n${await scenario.browser.page_line()}`;
          throw site;
        }
      });
    };

  return {
    // https://codecept.io/web-api/#amacceptingpopups
    amAcceptingPopups: step("am accepting popups", async (browser) =>
      browser.accept_popups(),
    ),
    // https://codecept.io/web-api/#amonpage
    amOnPage: step("am on page", (browser, _, path: string) =>
      browser.navigate(new URL(path, config.url).href),
    ),
    // https://codecept.io/web-api/#checkoption
    checkOption: step("check option", (browser, scopes, field: Locator) =>
      browser.check(scopes, field),
    ),
    // https://codecept.io/web-api/#click
    click: step("click", async (browser, scopes, locator: Locator) => {
      await browser.act("click", scopes, locator, (element) =>
        (element as HTMLElement).click(),
      );
      await browser.settle();
    }),
    // https://codecept.io/web-api/#dontsee
    dontSee: step("don't see", (browser, scopes, text: string) =>
      browser.until(
        `"${text}" is still visible`,
        (visible) => !visible,
        in_page(see_in_page, scopes, text),
      ),
    ),
    // https://codecept.io/web-api/#dontseeelement
    dontSeeElement: step(
      "don't see element",
      (browser, scopes, locator: Locator) =>
        browser.until(
          `${JSON.stringify(locator)} is still visible`,
          (visible) => !visible,
          in_page(element_in_page, scopes, locator),
        ),
    ),
    // https://codecept.io/web-api/#fillfield
    fillField: step(
      "fill field",
      (browser, scopes, field: Locator, value: string) =>
        browser.fill(scopes, field, value),
    ),
    // https://codecept.io/web-api/#presskey
    pressKey: step("press key", async (browser, _, key: string) => {
      await browser.press(key);
      await browser.settle();
    }),
    // Not in CodeceptJS: "navigate by keyboard to …", like a user tabbing
    pressKeyUntilFocused: step(
      "press key until focused",
      (browser, scopes, key: string, locator: Locator) =>
        browser.press_until_focused(scopes, key, locator),
    ),
    // https://codecept.io/web-api/#see
    see: step("see", (browser, scopes, text: string) =>
      browser.until(
        `"${text}" is not visible`,
        (visible) => visible === true,
        in_page(see_in_page, scopes, text),
      ),
    ),
    // https://codecept.io/web-api/#seeelement
    seeElement: step("see element", (browser, scopes, locator: Locator) =>
      browser.until(
        `${JSON.stringify(locator)} is not visible`,
        (visible) => visible === true,
        in_page(element_in_page, scopes, locator),
      ),
    ),
    // Not in CodeceptJS: keyboard focus is on the element a user would name
    seeFocused: step("see focused", (browser, scopes, locator: Locator) =>
      browser.until(
        `${JSON.stringify(locator)} is not focused`,
        (focused) => focused === true,
        in_page(focused_in_page, scopes, locator),
      ),
    ),
    // https://codecept.io/web-api/#seeincurrenturl
    seeInCurrentUrl: step("see in current url", (browser, _, part: string) =>
      browser.until(
        `url does not contain "${part}"`,
        (href) => String(href).includes(part),
        "location.href",
      ),
    ),
    // https://codecept.io/web-api/#seetitleequals
    seeTitleEquals: step("see title equals", (browser, _, title: string) =>
      browser.until(
        `title is not "${title}"`,
        (actual) => actual === title,
        "document.title",
      ),
    ),
    // https://codecept.io/basics/#within
    within(scope: Locator, fn: () => void) {
      // bun runs a nested describe's callback after its parent's, so the
      // scopes it sees are captured now
      const inner = [...scopes, scope];
      describe(`within ${JSON.stringify(scope)}`, () => {
        const outer = scopes;
        scopes = inner;
        try {
          fn();
        } finally {
          scopes = outer;
        }
      });
    },
  };
}

//

const TRANSIENT = /navigated or closed|navigation is already pending/;
const PRESS_CAP = 50;

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

  // A native confirm()/alert() blocks the page and every evaluate after it,
  // so once accepted, each action first replaces them in the current page.
  let popups = "";

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
        ${popups}
        if (!(${LOADED})) return "page still loading";
        const element = (${find})(${JSON.stringify(kind)}, ${JSON.stringify(locator)}, ${JSON.stringify(scopes)});
        if (!element) return "element not found";
        if (!(${actionable})(element)) return "element not visible or not enabled";
        (${action})(element);
        return "ok";
      })()`,
    );

  // The same wait as `act`, for actions that don't go through it.
  const ready = () =>
    until<boolean>(
      "page still loading",
      (loaded) => loaded === true,
      `(() => { ${INFLIGHT_SHIM}; ${popups} return ${LOADED}; })()`,
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
      popups = `window.confirm = () => true; window.alert = () => {};`;
    },
    act,
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

type Kind = "click" | "field" | "text";

const in_page = (
  fn: (element: Element | null, ...args: string[]) => unknown,
  scopes: Locator[],
  locator: Locator,
) =>
  `(() => {
    const find = ${find};
    return (${fn})(find("text", null, ${JSON.stringify(scopes)}), ${JSON.stringify(locator)});
  })()`;

// The functions below run in the page: they are sent as source text, so
// they must only use their arguments and each other through `find`.

// Every action first waits for the current document to be fully loaded with
// no request in flight. A navigating click's settle() can run against the
// old, already-complete page and return at once; the next action then lands
// while the new page's scripts are still loading, before they attach their
// handlers, and is lost.
// ponytail: a handler attached by a dynamic import() after load is not
// covered; wait on that import too if a page needs it.
const LOADED = `document.readyState === "complete" && !(window.__buncept_inflight > 0)`;

const INFLIGHT_SHIM = `
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

function see_in_page(root: Element | null, text: string) {
  const normalize = (value: string) =>
    value.replace(/\s+/g, " ").replace(/[’‘]/g, "'").trim();
  return (
    !!root &&
    normalize((root as HTMLElement).innerText).includes(normalize(text))
  );
}

function field_value(root: Element | null, field: Locator) {
  return root
    ? (find("field", field, [], root) as HTMLInputElement | null)?.value
    : undefined;
}

function element_in_page(root: Element | null, locator: Locator) {
  const element = root
    ? (find("text", locator, [], root) as HTMLElement)
    : null;
  return !!element && (element.offsetWidth > 0 || element.offsetHeight > 0);
}

// true when the focused element is the one `locator` names; otherwise what
// has focus, for the failure message
function focused_in_page(root: Element | null, locator: Locator) {
  const active = document.activeElement as HTMLElement | null;
  if (root && active && find("click", locator, [], root) === active)
    return true;
  return active
    ? (active.getAttribute("aria-label") ?? active.innerText ?? "")
        .trim()
        .slice(0, 80) || active.tagName
    : null;
}

// true once checked; otherwise clicks the label, like a user, and reports
function check_in_page(root: Element | null, field: Locator) {
  const input = root
    ? (find("field", field, [], root) as HTMLInputElement | null)
    : null;
  if (!input) return "element not found";
  if (input.checked) return true;
  (input.labels?.[0] ?? input).click();
  return false;
}

function actionable(element: Element) {
  const style = getComputedStyle(element);
  const box = element as HTMLElement;
  return (
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    box.offsetWidth > 0 &&
    box.offsetHeight > 0 &&
    !element.hasAttribute("disabled") &&
    !element.hasAttribute("readonly")
  );
}

// Resolves a locator inside the `scopes` chain, the way CodeceptJS does for
// click and fillField, plus a last-resort click on any visible text.
// `kind: "text"` with a null locator returns the innermost scope itself.
function find(
  kind: Kind,
  locator: Locator | null,
  scopes: Locator[],
  start: Element = document.body,
): Element | null {
  const normalize = (value: string | null | undefined) =>
    (value ?? "").replace(/\s+/g, " ").replace(/[’‘]/g, "'").trim();
  const visible = (element: Element) =>
    (element as HTMLElement).offsetWidth > 0 ||
    (element as HTMLElement).offsetHeight > 0;
  const all = (root: Element, selector: string) =>
    Array.from(root.querySelectorAll(selector));
  const innermost = (elements: Element[]) =>
    elements.find(
      (element) =>
        !elements.some((other) => other !== element && element.contains(other)),
    ) ?? null;

  const resolve = (
    root: Element,
    kind: Kind,
    locator: Locator,
  ): Element | null => {
    if (typeof locator !== "string") {
      if ("role" in locator) {
        // Explicit role, or the implicit ARIA role of the tags this app renders
        const implicit: Record<string, string> = {
          button: "button, input[type=button], input[type=submit]",
          checkbox: "input[type=checkbox]",
          combobox: "select",
          dialog: "dialog",
          heading: "h1, h2, h3, h4, h5, h6",
          link: "a[href]",
          radio: "input[type=radio]",
          row: "tr",
          textbox:
            "input:not([type]), input[type=text], input[type=email], textarea",
        };
        const selector = [`[role="${locator.role}"]`, implicit[locator.role]]
          .filter(Boolean)
          .join(", ");
        // ponytail: accessible name = aria-label, label, text, title, value;
        // no aria-labelledby, add it when a page needs it
        const name = (element: Element) =>
          [
            element.getAttribute("aria-label"),
            Array.from((element as HTMLInputElement).labels ?? [])
              .map((label) => label.textContent)
              .join(" "),
            element.textContent,
            element.getAttribute("title"),
            (element as HTMLInputElement).value,
          ]
            .map(normalize)
            .find(Boolean) ?? "";
        return (
          all(root, selector).find(
            (element) =>
              locator.name === undefined ||
              name(element) === normalize(locator.name),
          ) ?? null
        );
      }
      if ("css" in locator) return root.querySelector(locator.css);
      const row = normalize(locator.row);
      return (
        all(root, "tr").find((tr) => normalize(tr.textContent).includes(row)) ??
        null
      );
    }
    // CodeceptJS "~label": the element whose aria-label is exactly label
    if (locator.startsWith("~")) {
      const label = normalize(locator.slice(1));
      return (
        all(root, "[aria-label]").find(
          (element) => normalize(element.getAttribute("aria-label")) === label,
        ) ?? null
      );
    }
    const text = normalize(locator);
    if (kind === "field") {
      const fields = all(root, "input, textarea, select");
      const by = (read: (field: Element) => string | null | undefined) =>
        fields.find((field) => normalize(read(field)) === text);
      return (
        by((field) =>
          Array.from((field as HTMLInputElement).labels ?? [])
            .map((label) => label.textContent)
            .join(" "),
        ) ??
        by((field) => field.getAttribute("placeholder")) ??
        by((field) => field.getAttribute("aria-label")) ??
        by((field) => field.getAttribute("name")) ??
        by((field) => field.getAttribute("title")) ??
        null
      );
    }
    if (kind === "click") {
      const clickables = all(
        root,
        "a, button, [role=button], [role=link], input[type=submit], input[type=button]",
      ).filter(visible);
      const label = (element: Element) =>
        normalize(element.textContent) ||
        normalize((element as HTMLInputElement).value);
      return (
        clickables.find((element) => label(element) === text) ??
        clickables.find((element) => label(element).includes(text)) ??
        all(root, "[aria-label]").find(
          (element) => normalize(element.getAttribute("aria-label")) === text,
        ) ??
        all(root, "[title]").find(
          (element) => normalize(element.getAttribute("title")) === text,
        ) ??
        all(root, "label").find((element) =>
          normalize(element.textContent).includes(text),
        ) ??
        innermost(
          all(root, "*").filter(
            (element) =>
              visible(element) && normalize(element.textContent).includes(text),
          ),
        )
      );
    }
    // A scope: an aria-label, else the innermost element showing the text
    return (
      all(root, "[aria-label]").find((element) =>
        normalize(element.getAttribute("aria-label")).includes(text),
      ) ??
      innermost(
        all(root, "*").filter(
          (element) =>
            visible(element) && normalize(element.textContent).includes(text),
        ),
      )
    );
  };

  let root: Element | null = start;
  for (const scope of scopes) {
    root = resolve(root, "text", scope);
    if (!root) return null;
  }
  return locator === null ? root : resolve(root, kind, locator);
}
