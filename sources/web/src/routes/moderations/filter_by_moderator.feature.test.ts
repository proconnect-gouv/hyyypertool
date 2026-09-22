import {
  base_url,
  expect,
  getByRole,
  getByText,
  page,
  search_moderations,
  setup_feature_test,
  test,
} from "#src/testing";

//

setup_feature_test();

//

test("Filtrer par modérateur affiche les modérations traitées par ce modérateur", async () => {
  await page.navigate(`${base_url}/moderations`);
  await expect(page).toHaveTitle("Liste des moderations");
  await expect(getByText("44023386400014")).not.toBeVisible();

  await search_moderations(
    "by:moderateur@beta.gouv.fr",
    getByText("44023386400014"),
  );
});

test("Filtrer par un autre modérateur affiche ses modérations", async () => {
  const raphael_moderation_link = getByRole("link", {
    name: "Modération non vérifié de Raphael Dubigny pour 13002526500013",
  });

  await page.navigate(`${base_url}/moderations`);
  await expect(page).toHaveTitle("Liste des moderations");
  await expect(raphael_moderation_link).not.toBeVisible();

  await search_moderations("by:admin@beta.gouv.fr", raphael_moderation_link);
});
