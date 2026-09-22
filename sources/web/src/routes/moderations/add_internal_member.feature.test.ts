import {
  base_url,
  click_label_until,
  expect_table_contains,
  is_checked,
  is_q,
  named_table_rows,
  page,
  setup_feature_test,
  to_have_title,
} from "#src/testing";
import { test } from "bun:test";

//

setup_feature_test();

//

const filter_box = 'css:[placeholder="Filtrer les modérations…"]';
const marie_moderation_link =
  'css:[aria-label="Modération non vérifié de Marie Bon pour 57206768400017"]';
const raphael_moderation_link =
  'css:[aria-label="Modération non vérifié de Raphael Dubigny pour 81403721400016"]';
const revealed_q = is_q("is:pending sort:created-asc");

//

test("Marie est un membre interne de l'organization", async () => {
  await page.navigate(`${base_url}/moderations`);
  await page.waitForLoadState();
  await page.waitFor("text:Liste des moderations");

  await click_label_until(/🔓 Non vérifié/, revealed_q);

  await page.click(marie_moderation_link);
  await page.waitForLoadState();
  await to_have_title(
    "Modération non vérifié de Marie Bon pour 57206768400017",
  );

  await page.click("text:👥 0 membre connu dans l’organisation");
  expect_table_contains(
    await named_table_rows("👥 0 membre connu dans l’organisation"),
    [[""]],
  );

  await page.click("text:✅ Accepter");
  await click_label_until(
    /^Ajouter Marie à l'organisation EN TANT QU'INTERNE$/,
    is_checked("add_member_internal"),
  );
  await page.click(
    'css:[aria-label="la modale de validation"] button[type="submit"]',
  );
  await page.click("text:Retour immédiat");

  await page.waitFor("text:Liste des moderations");

  await page.locator(filter_box).fill("is:processed");
  await page.press("Enter");

  await page.click(marie_moderation_link);

  await page.click("text:👥 1 membre connu dans l’organisation");
  expect_table_contains(
    await named_table_rows("👥 1 membre connu dans l’organisation"),
    [
      ["Prénom", "Nom"],
      ["Marie", "Bon"],
    ],
  );
});

test("Raphael est déjà membre de l'organisation mais sa modération peut être validée", async () => {
  await page.navigate(`${base_url}/moderations`);
  await page.waitForLoadState();
  await page.waitFor("text:Liste des moderations");

  await click_label_until(/🔓 Non vérifié/, revealed_q);

  await page.click(raphael_moderation_link);
  await page.waitForLoadState();
  await to_have_title(
    "Modération non vérifié de Raphael Dubigny pour 81403721400016",
  );

  await page.click("text:✅ Accepter");
  await click_label_until(
    /^Ajouter Raphael à l'organisation EN TANT QU'INTERNE$/,
    is_checked("add_member_internal"),
  );
  await page.click(
    'css:[aria-label="la modale de validation"] button[type="submit"]',
  );
  await page.click("text:Retour immédiat");

  await page.waitFor("text:Liste des moderations");
});