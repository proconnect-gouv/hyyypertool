import {
  base_url,
  expect,
  getByPlaceholder,
  getByRole,
  getByText,
  page,
  setup_feature_test,
  test,
} from "#src/testing";

//

setup_feature_test();

//

test("Moderator can search a moderation by email", async () => {
  await page.navigate(`${base_url}/moderations`);
  await expect(getByText("Liste des moderations")).toBeVisible();
  await expect(getByText("Richard")).toBeVisible();

  await getByPlaceholder("Filtrer les modérations…").type(
    "is:pending email:jeanbon",
  );

  await expect(getByText("13002526500013")).toBeVisible();
  await expect(getByText("Raphael")).not.toBeVisible();
});

test("Moderator can search a moderation by SIRET", async () => {
  await page.navigate(`${base_url}/moderations`);
  await expect(getByText("Liste des moderations")).toBeVisible();
  await expect(getByText("Richard")).toBeVisible();

  await getByPlaceholder("Filtrer les modérations…").type(
    "is:pending siret:51935970700022",
  );

  await expect(getByText("51935970700022")).toBeVisible();
  await expect(getByText("Raphael")).not.toBeVisible();
});

test("Moderator can explore a moderation from the list", async () => {
  await page.navigate(`${base_url}/moderations`);
  await expect(getByText("Liste des moderations")).toBeVisible();
  await expect(getByText("Richard")).toBeVisible();

  await getByRole("link", {
    name: "Modération a traiter de Jean Bon pour 13002526500013",
  }).click();

  await expect(page).toHaveTitle(
    "Modération a traiter de Jean Bon pour 13002526500013",
  );
  await expect(getByText("jeanbon@yopmail.com")).toBeVisible();
});
