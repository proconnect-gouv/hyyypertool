import {
  base_url,
  click_label_until,
  expect,
  expect_table_contains,
  getByRole,
  getByText,
  is_checked,
  is_q,
  named_table_rows,
  page,
  search_moderations,
  setup_feature_test,
  test,
} from "#src/testing";

//

setup_feature_test();

//

const marie_moderation_link = () =>
  getByRole("link", {
    name: "Modération non vérifié de Marie Bon pour 57206768400017",
  });
const revealed_q = is_q("is:pending sort:created-asc");

//

test("Marie est un membre externe de l'organization", async () => {
  await page.navigate(`${base_url}/moderations`);
  await expect(page).toHaveTitle("Liste des moderations");

  await click_label_until(/🔓 Non vérifié/, revealed_q);

  await marie_moderation_link().click();
  await expect(page).toHaveTitle(
    "Modération non vérifié de Marie Bon pour 57206768400017",
  );

  await getByText("👥 0 membre connu dans l’organisation").click();
  expect_table_contains(
    await named_table_rows("👥 0 membre connu dans l’organisation"),
    [[""]],
  );

  await getByRole("button", { name: "✅ Accepter" }).click();
  await click_label_until(
    /^Ajouter Marie à l'organisation EN TANT QU'EXTERNE$/,
    is_checked("add_member_external"),
  );
  // ponytail: bunwright can't scope a locator inside another, getByLabel(modal).getByRole(button) once it can
  await page.click(
    'css:[aria-label="la modale de validation"] button[type="submit"]',
  );
  await getByText("Retour immédiat").click();

  await expect(page).toHaveTitle("Liste des moderations");

  await search_moderations("is:processed", marie_moderation_link());

  await marie_moderation_link().click();

  await getByText("👥 1 membre connu dans l’organisation").click();
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
  await expect(page).toHaveTitle("Liste des moderations");

  await click_label_until(/🔓 Non vérifié/, revealed_q);

  await marie_moderation_link().click();
  await expect(page).toHaveTitle(
    "Modération non vérifié de Marie Bon pour 57206768400017",
  );

  await getByText("👥 0 membre connu dans l’organisation").click();
  expect_table_contains(
    await named_table_rows("👥 0 membre connu dans l’organisation"),
    [[""]],
  );

  await getByText("🌐 0 domaine connu dans l’organisation").click();
  expect_table_contains(
    await named_table_rows("🌐 0 domaine connu dans l’organisation"),
    [[""]],
  );

  await getByRole("button", { name: "✅ Accepter" }).click();
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
  // ponytail: bunwright can't scope a locator inside another, getByLabel(modal).getByRole(button) once it can
  await page.click(
    'css:[aria-label="la modale de validation"] button[type="submit"]',
  );
  await getByText("Retour immédiat").click();

  await expect(page).toHaveTitle("Liste des moderations");

  await search_moderations("is:processed", marie_moderation_link());

  await marie_moderation_link().click();

  await getByText("👥 1 membre connu dans l’organisation").click();
  expect_table_contains(
    await named_table_rows("👥 1 membre connu dans l’organisation"),
    [
      ["Prénom", "Nom", "Interne", "Email", "Type de vérification"],
      ["Marie", "Bon", "❌", "marie.bon@fr.bosch.com", "domain"],
    ],
  );

  await getByText("🌐 1 domaine connu dans l’organisation").click();
  expect_table_contains(
    await named_table_rows("🌐 1 domaine connu dans l’organisation"),
    [
      ["Domain", "Type"],
      ["fr.bosch.com", "external"],
    ],
  );
});
