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

test("Pierre Bon veut rejoindre l'association ALDP", async () => {
  await page.navigate(`${base_url}/moderations`);
  await getByRole("link", {
    name: "Modération big organisation de Pierre Bon pour 81797266400038",
  }).click();
  await expect(page).toHaveTitle(
    "Modération big organisation de Pierre Bon pour 81797266400038",
  );

  await expect(
    getByText(
      "Pierre Bon a rejoint l'organisation de plus de 50 employés « Association des loisirs de la diversite et du partage (ALDP) »",
    ),
  ).toBeVisible();
  await expect(
    getByText("Liste dirigeants - Annuaire entreprise API"),
  ).toBeVisible();
});
