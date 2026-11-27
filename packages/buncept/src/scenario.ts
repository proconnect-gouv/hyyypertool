import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { create_browser, in_page, type Browser } from "./browser";
import { config } from "./config";
import { element_in_page, focused_in_page, see_in_page } from "./page/checks";
import type { Locator } from "./protocol";

//

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

// Each step is its own test, so the bun reporter prints the step log: a
// test reads as a list of sentences, with no `await`.
function create_actor(scenario: { browser: Browser; failed_step?: string }) {
  let scopes: Locator[] = [];
  const step = <A extends unknown[]>(
    name: string,
    run: (browser: Browser, scopes: Locator[], ...args: A) => Promise<void>,
    timeout?: number | ((args: A) => number),
  ) =>
    function call(...args: A) {
      // Re-point failures at the test line that called the step
      const site = new Error();
      Error.captureStackTrace(site, call);
      const label = `I ${name} ${args.map((arg) => JSON.stringify(arg)).join(", ")}`;
      const step_scopes = scopes;
      test(
        label,
        async () => {
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
            const reason =
              error instanceof Error ? error.message : String(error);
            site.message = `${label}\n${reason}\n${await scenario.browser.page_line()}`;
            throw site;
          }
        },
        typeof timeout === "function" ? timeout(args) : timeout,
      );
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
    // https://codecept.io/web-api/#wait
    wait: step(
      "wait",
      (browser, _, seconds: number) => browser.wait(seconds),
      ([seconds]) => seconds * 1000 + config.timeout,
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
