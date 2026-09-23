import {
  hyyyper_pglite,
  empty_database as hyyyperbase_empty_database,
} from "@~/hyyyperbase/testing";
import { insert_moderateur } from "@~/hyyyperbase/testing/users";
import { insert_database } from "@~/identite-proconnect/database/seed/insert";
import {
  empty_database as identite_empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/database/testing";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  expect as base_expect,
  type Matchers,
} from "bun:test";
import { browser, type Chain, type Locator, type Selector } from "bunwright";
import { create_testing_router } from "./router";

//

export let page: Awaited<ReturnType<typeof browser.newPage>>;
export let base_url = "";

export function setup_feature_test() {
  let server: ReturnType<typeof Bun.serve>;
  beforeAll(migrate);
  beforeAll(() => {
    server = Bun.serve({ fetch: create_testing_router().fetch, port: 0 });
    base_url = `http://localhost:${server.port}`;
  });
  afterAll(() => server.stop(true));
  afterAll(() => browser.close());
  beforeEach(identite_empty_database);
  beforeEach(hyyyperbase_empty_database);
  beforeEach(() => insert_database(pg));
  beforeEach(() => insert_moderateur(hyyyper_pglite));
  beforeEach(async () => {
    page = await browser.newPage({
      backend:
        process.platform === "linux"
          ? {
              type: "chrome",
              argv: [
                "--no-sandbox",
                `--user-data-dir=/tmp/bunwright-${crypto.randomUUID()}`,
              ],
            }
          : undefined,
    });
  });
  afterEach(() => page.close());
}

export async function click_label_until(
  label_pattern: RegExp,
  verify: () => boolean,
) {
  const find_and_click_label = new Function(
    `return () => {
      const pattern = new RegExp(${JSON.stringify(label_pattern.source)});
      const label = Array.from(document.querySelectorAll("label")).find(
        (element) => pattern.test(element.textContent ?? ""),
      );
      if (!label) return false;
      label.click();
      return true;
    }`,
  )() as () => boolean;
  const deadline = Date.now() + 10_000;
  while (Date.now() < deadline) {
    if (await page.evaluate(verify)) return;
    await page.evaluate(find_and_click_label);
    await Bun.sleep(100);
  }
  throw new Error(`label interaction failed: ${label_pattern.source}`);
}

export const is_checked = (element_id: string) =>
  new Function(
    `return () => document.getElementById(${JSON.stringify(element_id)})?.checked === true;`,
  )() as () => boolean;

export const is_q = (expected: string) =>
  new Function(
    `return () => document.getElementById("q")?.value === ${JSON.stringify(expected)};`,
  )() as () => boolean;

export async function named_table_rows(table_name: string) {
  const describedby_id = await page
    .locator(`text:${table_name}`)
    .evaluate(
      (element) =>
        element.closest("h3")?.id ?? element.querySelector("h3")?.id ?? "",
    );
  await page.waitForSelector(`css:table[aria-describedby="${describedby_id}"]`);
  return page
    .locator(`css:table[aria-describedby="${describedby_id}"]`)
    .evaluate((table) =>
      Array.from(table.querySelectorAll("tr")).map((tr, index) =>
        Array.from(tr.querySelectorAll(index === 0 ? "th" : "td")).map(
          (cell) => {
            const clone = cell.cloneNode(true) as HTMLElement;
            clone
              .querySelectorAll("script")
              .forEach((script) => script.remove());
            return clone.textContent?.trim() ?? "";
          },
        ),
      ),
    );
}

export function expect_table_contains(
  actual: string[][],
  expected: string[][],
): void {
  const missing = expected
    .filter((row) => row.some((cell) => cell.trim()))
    .filter(
      (row) =>
        !actual.some((actual_row) =>
          row.every((cell) =>
            actual_row.some((actual_cell) => actual_cell === cell.trim()),
          ),
        ),
    );
  base_expect(missing).toEqual([]);
}

// Playwright-style locators — https://playwright.dev/docs/locators
// ponytail: text is interpolated as-is, escape it once a test needs a `"`.

type DescribedLocator = Chain<Locator> & { description: string };

const ACTIONS = new Set(["click", "dblClick", "fill", "press", "type"]);

// Actions run through bunwright's lazy chain proxy, so a failure's stack ends
// inside bunwright; re-point it at the test line that called the action.
// ponytail: wrapped actions return a plain Promise, no further chaining.
const described = (selector: Selector, description: string) =>
  new Proxy(Object.assign(page.locator(selector), { description }), {
    get(target, key, receiver) {
      const value = Reflect.get(target, key, receiver);
      if (!ACTIONS.has(String(key))) return value;
      // Sync wrapper so captureStackTrace can drop it: the error's first
      // frame, and bun's code preview, is then the test line.
      const action = (...args: unknown[]) => {
        const call_site = new Error();
        Error.captureStackTrace(call_site, action);
        return (async () => {
          try {
            return await value.apply(target, args);
          } catch (error) {
            if (!(error instanceof Error)) throw error;
            call_site.name = error.name;
            call_site.message = `${error.message}\n${await page_line()}`;
            throw call_site;
          }
        })();
      };
      return action;
    },
  }) as DescribedLocator;

export const getByRole = (role: string, { name }: { name?: string } = {}) =>
  described(
    name === undefined ? `role:${role}` : `role:${role}[name="${name}"]`,
    `getByRole('${role}'${name === undefined ? "" : `, { name: '${name}' }`})`,
  );

export const getByText = (text: string, { exact = false } = {}) => {
  const match = exact
    ? `normalize-space(.)="${text}"`
    : `contains(normalize-space(.), "${text}")`;
  return described(
    `xpath://body//*[not(self::script or self::style or self::template)][${match} and not(*[${match}])]`,
    `getByText('${text}'${exact ? ", { exact: true }" : ""})`,
  );
};

export const getByLabel = (text: string) =>
  described(
    `xpath://*[@aria-label="${text}"] | //*[@id=//label[normalize-space(.)="${text}"]/@for] | //label[normalize-space(.)="${text}"]//*[self::input or self::select or self::textarea]`,
    `getByLabel('${text}')`,
  );

export const getByPlaceholder = (text: string) =>
  described(`css:[placeholder="${text}"]`, `getByPlaceholder('${text}')`);

export const getByTitle = (text: string) =>
  described(`css:[title="${text}"]`, `getByTitle('${text}')`);

// Playwright-style web-first assertions — https://playwright.dev/docs/test-assertions#add-custom-matchers-using-expectextend

async function poll<T>(
  read: () => PromiseLike<T>,
  done: (value: T) => boolean,
  timeout: number,
) {
  const deadline = Date.now() + timeout;
  for (;;) {
    try {
      const value = await read();
      if (done(value) || Date.now() >= deadline) return value;
    } catch (error) {
      // A navigation still in flight tears down the page mid-evaluate
      const navigating = String(error).includes("navigated or closed");
      if (!navigating || Date.now() >= deadline) throw error;
    }
    await Bun.sleep(100);
  }
}

async function page_line() {
  const url = await page.evaluate(() => location.href);
  const title = await page.evaluate(() => document.title);
  return `Page:     ${url} — "${title}"`;
}

base_expect.extend({
  async toBeVisible(actual, options?: { timeout?: number }) {
    const locator = actual as DescribedLocator;
    const timeout = options?.timeout ?? page.retryTimeout;
    const state = await poll(
      async () =>
        (await locator.count()) === 0
          ? "element not found"
          : (await locator.isVisible())
            ? "visible"
            : "hidden",
      (state) => (state === "visible") !== this.isNot,
      timeout,
    );
    const pass = state === "visible";
    const page_info = pass === this.isNot ? await page_line() : "";
    return {
      pass,
      message: () =>
        [
          `Locator:  ${locator.description ?? String(Reflect.get(locator, "selector"))}`,
          `Expected: ${this.isNot ? "not visible" : "visible"}`,
          `Received: ${state}`,
          `Timeout:  ${timeout}ms`,
          page_info,
        ].join("\n"),
    };
  },
  async toHaveTitle(actual, expected: string, options?: { timeout?: number }) {
    const target = actual as typeof page;
    const timeout = options?.timeout ?? page.retryTimeout;
    const title = await poll(
      () => target.evaluate(() => document.title),
      (title) => (title === expected) !== this.isNot,
      timeout,
    );
    const pass = title === expected;
    const page_info = pass === this.isNot ? await page_line() : "";
    return {
      pass,
      message: () =>
        [
          `Expected: ${this.isNot ? "not " : ""}${this.utils.printExpected(expected)}`,
          `Received: ${this.utils.printReceived(title)}`,
          `Timeout:  ${timeout}ms`,
          page_info,
        ].join("\n"),
    };
  },
  async toHaveURL(
    actual,
    expected: string | RegExp,
    options?: { timeout?: number },
  ) {
    const target = actual as typeof page;
    const timeout = options?.timeout ?? page.retryTimeout;
    const matches = (url: string) =>
      typeof expected === "string" ? url === expected : expected.test(url);
    const url = await poll(
      () => target.evaluate(() => location.href),
      (url) => matches(url) !== this.isNot,
      timeout,
    );
    const pass = matches(url);
    const page_info = pass === this.isNot ? await page_line() : "";
    return {
      pass,
      message: () =>
        [
          `Expected: ${this.isNot ? "not " : ""}${this.utils.printExpected(expected)}`,
          `Received: ${this.utils.printReceived(url)}`,
          `Timeout:  ${timeout}ms`,
          page_info,
        ].join("\n"),
    };
  },
  // Retries the whole block until it stops throwing — for effects that only
  // stick once an island has hydrated. Give inner assertions a short timeout.
  async toPass(actual, options?: { timeout?: number }) {
    const block = actual as () => Promise<unknown>;
    const timeout = options?.timeout ?? page.retryTimeout;
    const deadline = Date.now() + timeout;
    let last_error: unknown;
    let attempts = 0;
    do {
      attempts++;
      try {
        await block();
        return { pass: true, message: () => "Expected: block to fail" };
      } catch (error) {
        last_error = error;
      }
      await Bun.sleep(100);
    } while (Date.now() < deadline);
    const page_info = await page_line();
    return {
      pass: false,
      message: () =>
        [
          `Timeout:  ${timeout}ms, ${attempts} attempts`,
          page_info,
          "",
          "Last attempt failed with:",
          last_error instanceof Error ? last_error.message : String(last_error),
        ].join("\n"),
    };
  },
});

type WebFirstMatchers = {
  toBeVisible(options?: { timeout?: number }): Promise<void>;
  toHaveTitle(expected: string, options?: { timeout?: number }): Promise<void>;
  toHaveURL(
    expected: string | RegExp,
    options?: { timeout?: number },
  ): Promise<void>;
  toPass(options?: { timeout?: number }): Promise<void>;
};

// bun's expect.extend mutates the global expect and returns void, unlike
// Playwright's which returns a new one; this cast scopes the matcher types
// to files importing expect from here.
export const expect = base_expect as (<T>(
  actual: T,
  message?: string,
) => Matchers<T> & WebFirstMatchers & { not: Matchers<T> & WebFirstMatchers }) &
  typeof base_expect;

// The search bar island resets #q when it hydrates, so a query typed before
// that is lost: retry until the URL carries the query and `until`, if
// given, shows.
export async function search_moderations(q: string, until?: DescribedLocator) {
  await expect(async () => {
    await getByPlaceholder("Filtrer les modérations…").fill(q);
    await page.press("Enter");
    await expect(page).toHaveURL(
      // Enter accepts the autocomplete suggestion, which appends a space
      new RegExp(`[?&]q=${encodeURIComponent(q)}(%20)*(&|$)`),
      { timeout: 1_000 },
    );
    if (until) await expect(until).toBeVisible({ timeout: 1_000 });
  }).toPass();
}

export { test } from "bun:test";
