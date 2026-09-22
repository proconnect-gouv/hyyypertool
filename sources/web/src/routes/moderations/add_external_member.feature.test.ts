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
import { expect, test } from "bun:test";

//

setup_feature_test();

//

const filter_box = 'css:[placeholder="Filtrer les modérations…"]';
const marie_moderation_link =
  'css:[aria-label="Modération non vérifié de Marie Bon pour 57206768400017"]';
const revealed_q = is_q("is:pending sort:created-asc");

//

test("Marie est un membre externe de l'organization", async () => {
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
    /^Ajouter Marie à l'organisation EN TANT QU'EXTERNE$/,
    is_checked("add_member_external"),
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
      ["Prénom", "Nom", "Interne", "Email", "Type de vérification"],
      [
        "Marie",
        "Bon",
        "❌",
        "marie.bon@fr.bosch.com",
        "no_validation_means_available",
      ],
    ],
  );
});

test("Marie est validée en externe avec notification et ajout du domaine en externe", async () => {
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

  await page.click("text:🌐 0 domaine connu dans l’organisation");
  expect_table_contains(
    await named_table_rows("🌐 0 domaine connu dans l’organisation"),
    [[""]],
  );

  await page.click("text:✅ Accepter");
  await click_label_until(
    /^Ajouter Marie à l'organisation EN TANT QU'EXTERNE$/,
    is_checked("add_member_external"),
  );
  await click_label_until(
    /^J'autorise le domaine fr\.bosch\.com en externe à l'organisation$/,
    is_checked("add_domain_checkbox"),
  );
  await click_label_until(
    /^Notifier marie\.bon@fr\.bosch\.com du traitement de la modération\.$/,
    is_checked("send_notification_checkbox"),
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
      ["Prénom", "Nom", "Interne", "Email", "Type de vérification"],
      ["Marie", "Bon", "❌", "marie.bon@fr.bosch.com", "domain"],
    ],
  );

  await page.click("text:🌐 1 domaine connu dans l’organisation");
  expect_table_contains(
    await named_table_rows("🌐 1 domaine connu dans l’organisation"),
    [
      ["Domain", "Type"],
      ["fr.bosch.com", "external"],
    ],
  );
});
