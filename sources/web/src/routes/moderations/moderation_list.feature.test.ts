import { create_testing_router } from "#src/testing";
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
  expect,
  test,
} from "bun:test";
import { browser } from "bunwright";

//

let server: ReturnType<typeof Bun.serve>;
let base_url: string;
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

let page: Awaited<ReturnType<typeof browser.newPage>>;
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

//

test("Moderator can search a moderation by email", async () => {
  await page.navigate(`${base_url}/moderations`);
  expect(await page.exists("text:Liste des moderations")).toBe(true);
  expect(await page.exists("text:Richard")).toBe(true);

  await page.type(
    'css:[placeholder="Filtrer les modérations…"]',
    "is:pending email:jeanbon",
  );

  expect(await page.exists("text:13002526500013")).toBe(true);
  expect(await page.exists("text:Raphael")).toBe(false);
});

test("Moderator can search a moderation by SIRET", async () => {
  await page.navigate(`${base_url}/moderations`);
  expect(await page.exists("text:Liste des moderations")).toBe(true);
  expect(await page.exists("text:Richard")).toBe(true);

  await page.type(
    'css:[placeholder="Filtrer les modérations…"]',
    "is:pending siret:51935970700022",
  );

  expect(await page.exists("text:51935970700022")).toBe(true);
  expect(await page.exists("text:Raphael")).toBe(false);
});

test("Moderator can explore a moderation from the list", async () => {
  await page.navigate(`${base_url}/moderations`);
  expect(await page.exists("text:Liste des moderations")).toBe(true);
  expect(await page.exists("text:Richard")).toBe(true);

  await page.click(
    'css:[aria-label="Modération a traiter de Jean Bon pour 13002526500013"]',
  );
  await page.waitForLoadState();

  const title = await page.evaluate(() => document.title);
  expect(title).toBe("Modération a traiter de Jean Bon pour 13002526500013");
  expect(await page.exists("text:jeanbon@yopmail.com")).toBe(true);
});
