// Parts of this file (actionability check, click dispatched in-page, fill by
// focus + select + type-over, retry on "navigated or closed") are adapted
// from bunwright 0.3.2 and this repo's patches/bunwright@0.3.2.patch:
//
//   Bunwright: The lightweight browser automation library for Bun
//   Copyright (C) Jonas Perusquia Morales
//   Licensed under the GNU Lesser General Public License v2.1
//   https://github.com/jonaspm/bunwright
//
// Modified for hyyypertool: rewritten as a CodeceptJS-style `I` actor over
// Bun.WebView, relicensed under the GPL-3.0 as LGPL-2.1 §3 allows.

import { test } from "bun:test";

//

// CodeceptJS locators — https://codecept.io/locators/
// A string is matched the way a user reads the page; objects are strict.
export type Locator = string | { css: string } | { row: string };

export const config = { url: "", timeout: 10_000 };

export type Actor = ReturnType<typeof create_actor>;

// https://codecept.io/basics/#writing-tests
export function Scenario(title: string, body: (context: { I: Actor }) => void) {
  test(title, async () => {
    const view = new Bun.WebView(
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
    const steps: Step[] = [];
    body({ I: create_actor(steps) });

    const browser = create_browser(view);
    const log = [title];
    const started = performance.now();
    try {
      for (const step of steps) {
        log.push(`${"  ".repeat(step.depth + 1)}${step.label}`);
        try {
          await step.run(browser, step.scopes);
        } catch (error) {
          const reason = error instanceof Error ? error.message : String(error);
          step.site.message = `${step.label}\n${reason}\n${await browser.page_line()}`;
          throw step.site;
        }
      }
      log.push(`  ✔ OK in ${Math.round(performance.now() - started)}ms`);
    } catch (error) {
      log.push(`  ✖ FAILED in ${Math.round(performance.now() - started)}ms`);
      throw error;
    } finally {
      // One write per scenario, so --parallel workers don't interleave lines
      process.stderr.write(`${log.join("\n")}\n\n`);
      view.close();
    }
  });
}

//

type Browser = ReturnType<typeof create_browser>;
type Step = {
  depth: number;
  label: string;
  run: (browser: Browser, scopes: Locator[]) => Promise<void>;
  scopes: Locator[];
  site: Error;
};

// Steps are queued synchronously, like CodeceptJS, then run in order by
// Scenario: a test reads as a list of sentences, with no `await`.
function create_actor(steps: Step[]) {
  const scopes: Locator[] = [];
  const step = <A extends unknown[]>(
    name: string,
    run: (browser: Browser, scopes: Locator[], ...args: A) => Promise<void>,
  ) =>
    function call(...args: A) {
      // Re-point failures at the test line that queued the step
      const site = new Error();
      Error.captureStackTrace(site, call);
      steps.push({
        depth: scopes.length,
        label: `I ${name} ${args.map((arg) => JSON.stringify(arg)).join(", ")}`,
        run: (browser, scopes) => run(browser, scopes, ...args),
        scopes: [...scopes],
        site,
      });
    };

  return {
    // https://codecept.io/web-api/#amonpage
    amOnPage: step("am on page", (browser, _, path: string) =>
      browser.navigate(new URL(path, config.url).href),
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
    // https://codecept.io/web-api/#see
    see: step("see", (browser, scopes, text: string) =>
      browser.until(
        `"${text}" is not visible`,
        (visible) => visible === true,
        in_page(see_in_page, scopes, text),
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
      steps.push({
        depth: scopes.length,
        label: `Within ${JSON.stringify(scope)}:`,
        run: async () => {},
        scopes: [],
        site: new Error(),
      });
      scopes.push(scope);
      try {
        fn();
      } finally {
        scopes.pop();
      }
    },
  };
}

//

const TRANSIENT = /navigated or closed|navigation is already pending/;

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
        const element = (${find})(${JSON.stringify(kind)}, ${JSON.stringify(locator)}, ${JSON.stringify(scopes)});
        if (!element) return "element not found";
        if (!(${actionable})(element)) return "element not visible or not enabled";
        (${action})(element);
        return "ok";
      })()`,
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
    act,
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
    press: (key: string) => serial(() => view.press(key)),
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
      if ("css" in locator) return root.querySelector(locator.css);
      const row = normalize(locator.row);
      return (
        all(root, "tr").find((tr) => normalize(tr.textContent).includes(row)) ??
        null
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
