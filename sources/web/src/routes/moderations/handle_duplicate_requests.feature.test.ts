import {
  base_url,
  expect,
  getByRole,
  getByText,
  page,
  setup_feature_test,
  test,
} from "#src/testing";

//

setup_feature_test();

//

test("Richard Bon veut rejoindre l'organisation Dengi - Leclerc", async () => {
  await page.navigate(`${base_url}/moderations`);
  await getByRole("link", {
    name: "Modération a traiter de Richard Bon pour 38514019900014",
  }).click();
  await expect(page).toHaveTitle(
    "Modération a traiter de Richard Bon pour 38514019900014",
  );

  await expect(
    getByText("Richard Bon veut rejoindre l'organisation « Dengi - Leclerc »"),
  ).toBeVisible();
  await expect(getByText("Attention : demande multiples")).toBeVisible();
  await expect(
    getByText("Il s'agit de la 2e demande pour cette organisation"),
  ).toBeVisible();
  await expect(getByText("Moderation#5 Accepté")).toBeVisible();
  await expect(getByText("Moderation#6 A traiter")).toBeVisible();
});
