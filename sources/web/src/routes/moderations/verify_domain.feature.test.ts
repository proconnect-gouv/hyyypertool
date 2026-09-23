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

test("Le nom de domaine est vérifié", async () => {
  await page.navigate(`${base_url}/moderations`);
  await expect(page).toHaveTitle("Liste des moderations");

  await click_label_until(
    /🔓 Non vérifié/,
    is_q("is:pending sort:created-asc"),
  );

  await marie_moderation_link().click();
  await expect(page).toHaveTitle(
    "Modération non vérifié de Marie Bon pour 57206768400017",
  );

  await getByText("🌐 0 domaine connu dans l’organisation").click();
  expect_table_contains(
    await named_table_rows("🌐 0 domaine connu dans l’organisation"),
    [[""]],
  );

  await getByRole("button", { name: "✅ Accepter" }).click();
  await click_label_until(
    /^J'autorise le domaine fr\.bosch\.com en interne à l'organisation$/,
    is_checked("add_domain_checkbox"),
  );
  // ponytail: bunwright can't scope a locator inside another, getByLabel(modal).getByRole(button) once it can
  await page.click(
    'css:[aria-label="la modale de validation"] button[type="submit"]',
  );
  await getByText("Retour immédiat").click();

  await expect(page).toHaveTitle("Liste des moderations");
  await search_moderations("is:processed", marie_moderation_link());
  await marie_moderation_link().click();

  await getByText("🌐 1 domaine connu dans l’organisation").click();
  expect_table_contains(
    await named_table_rows("🌐 1 domaine connu dans l’organisation"),
    [
      ["Domain", "Type"],
      ["fr.bosch.com", "verified"],
    ],
  );
});
