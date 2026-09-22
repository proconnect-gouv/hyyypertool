import {
  base_url,
  click_label_until,
  expect,
  expect_table_contains,
  getByPlaceholder,
  getByRole,
  getByText,
  is_checked,
  is_q,
  named_table_rows,
  page,
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
const raphael_moderation_link = () =>
  getByRole("link", {
    name: "Modération non vérifié de Raphael Dubigny pour 81403721400016",
  });
const revealed_q = is_q("is:pending sort:created-asc");

//

test("Marie est un membre interne de l'organization", async () => {
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
    /^Ajouter Marie à l'organisation EN TANT QU'INTERNE$/,
    is_checked("add_member_internal"),
  );
  // ponytail: bunwright can't scope a locator inside another, getByLabel(modal).getByRole(button) once it can
  await page.click(
    'css:[aria-label="la modale de validation"] button[type="submit"]',
  );
  await getByText("Retour immédiat").click();

  await expect(page).toHaveTitle("Liste des moderations");

  await getByPlaceholder("Filtrer les modérations…").fill("is:processed");
  await page.press("Enter");

  await marie_moderation_link().click();

  await getByText("👥 1 membre connu dans l’organisation").click();
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
  await expect(page).toHaveTitle("Liste des moderations");

  await click_label_until(/🔓 Non vérifié/, revealed_q);

  await raphael_moderation_link().click();
  await expect(page).toHaveTitle(
    "Modération non vérifié de Raphael Dubigny pour 81403721400016",
  );

  await getByRole("button", { name: "✅ Accepter" }).click();
  await click_label_until(
    /^Ajouter Raphael à l'organisation EN TANT QU'INTERNE$/,
    is_checked("add_member_internal"),
  );
  // ponytail: bunwright can't scope a locator inside another, getByLabel(modal).getByRole(button) once it can
  await page.click(
    'css:[aria-label="la modale de validation"] button[type="submit"]',
  );
  await getByText("Retour immédiat").click();

  await expect(page).toHaveTitle("Liste des moderations");
});
