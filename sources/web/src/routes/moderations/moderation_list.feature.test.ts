import {
  base_url,
  page,
  setup_feature_test,
  to_have_title,
} from "#src/testing";
import { expect, test } from "bun:test";

//

setup_feature_test();

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

  await to_have_title("Modération a traiter de Jean Bon pour 13002526500013");
  expect(await page.exists("text:jeanbon@yopmail.com")).toBe(true);
});
