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
import { afterAll, afterEach, beforeAll, beforeEach, expect } from "bun:test";
import { browser } from "bunwright";
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

export async function to_have_title(expected: string) {
  const deadline = Date.now() + 10_000;
  while (Date.now() < deadline) {
    if ((await page.evaluate(() => document.title)) === expected) return;
    await Bun.sleep(100);
  }
  expect(await page.evaluate(() => document.title)).toBe(expected);
}

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
  expect(missing).toEqual([]);
}
