import {
  base_url,
  expect,
  getByRole,
  page,
  search_moderations,
  setup_feature_test,
  test,
} from "#src/testing";

//

setup_feature_test();

//

const jean_bon_moderation_link = () =>
  getByRole("link", {
    name: "Modération a traiter de Jean Bon pour 13002526500013",
  });

test("Exclure un fournisseur de service masque les modérations associées", async () => {
  await page.navigate(`${base_url}/moderations`);
  await expect(jean_bon_moderation_link()).toBeVisible();

  await search_moderations('is:pending -service:"Annuaire des entreprises"');

  await expect(jean_bon_moderation_link()).not.toBeVisible();
});

test("Retirer un filtre réaffiche les modérations exclues", async () => {
  await page.navigate(`${base_url}/moderations`);
  await expect(page).toHaveTitle("Liste des moderations");

  await search_moderations('is:pending -service:"Annuaire des entreprises"');
  await expect(jean_bon_moderation_link()).not.toBeVisible();

  await search_moderations("is:pending", jean_bon_moderation_link());
});
