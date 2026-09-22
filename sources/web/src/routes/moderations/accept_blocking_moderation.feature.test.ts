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

const moderation_link =
  'css:[aria-label="Modération a traiter de Jean Bon pour 13002526500013"]';

test("Moderator can accept a blocking moderation with the toolbar", async () => {
  await page.navigate(`${base_url}/moderations`);
  await to_have_title("Liste des moderations");
  await page.waitFor("text:Liste des moderations");

  await page.click(moderation_link);
  await page.waitForLoadState();

  await to_have_title("Modération a traiter de Jean Bon pour 13002526500013");
  await page.waitFor('role:button[name="✅ Accepter"]');
  expect(await page.exists("text:jeanbon@yopmail.com")).toBe(true);

  await page.click('role:button[name="✅ Accepter"]');

  expect(
    await page.exists(
      `xpath://*[contains(normalize-space(.), "A propos de jeanbon@yopmail.com pour l'organisation Direction interministerielle du numerique (DINUM), je valide :")]`,
    ),
  ).toBe(true);
  expect(await page.exists('css:[aria-label="la modale de validation"]')).toBe(
    true,
  );

  await page.click('role:button[name="Terminer"]');
  await page.click('role:button[name="Annuler"]');

  await page.waitFor("text:Modération acceptée");
  expect(
    await page.exists(
      `xpath://*[contains(normalize-space(.), "Cette modération a été marqué comme traitée le")]`,
    ),
  ).toBe(true);
  expect(
    await page.exists(
      `xpath://*[contains(normalize-space(.), "Validé par moderateur@beta.gouv.fr")]`,
    ),
  ).toBe(true);

  await page.click('role:link[name="Moderations"]');
  await page.waitForLoadState();

  await page.waitFor("text:Liste des moderations");
  expect(await page.exists("text:13002526500013")).toBe(false);

  await page.evaluate(() => {
    const input = document.getElementById("q") as HTMLInputElement;
    input.value = "is:processed";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.click('css:[title="Rechercher"]');

  await page.waitForSelector(moderation_link, { timeout: 8000 });
  await page.click(moderation_link);
  await page.waitForLoadState();

  await to_have_title("Modération a traiter de Jean Bon pour 13002526500013");
});
