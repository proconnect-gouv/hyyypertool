import {
  base_url,
  expect,
  getByRole,
  page,
  setup_feature_test,
  test,
} from "#src/testing";

//

setup_feature_test();

//

const skip_link = () =>
  getByRole("link", { name: "Aller au contenu principal" });
const jean_bon_link = () =>
  getByRole("link", {
    name: "Modération a traiter de Jean Bon pour 51935970700022",
  });

async function tab_until_focused(locator: ReturnType<typeof getByRole>) {
  for (let tabs = 0; tabs < 50; tabs++) {
    if (await locator.evaluate((element) => element === document.activeElement))
      return;
    await page.press("Tab");
  }
  await expect(locator).toBeFocused({ timeout: 0 });
}

test("Naviguer au clavier depuis le haut de la page jusqu'aux rangées du tableau", async () => {
  await page.navigate(`${base_url}/moderations`);
  await expect(page).toHaveTitle("Liste des moderations");

  await page.press("Tab");
  await expect(skip_link()).toBeFocused();
  await page.press("Enter");

  await tab_until_focused(jean_bon_link());
  await expect(jean_bon_link()).toBeFocused();

  await page.press("Tab");
  await expect(
    getByRole("link", {
      name: "Modération a traiter de Jean Dré pour 51935970700022",
    }),
  ).toBeFocused();
});

test("Naviguer vers une modération avec le clavier", async () => {
  await page.navigate(`${base_url}/moderations`);
  await expect(page).toHaveTitle("Liste des moderations");

  await page.press("Tab");
  await expect(skip_link()).toBeFocused();
  await page.press("Enter");

  await tab_until_focused(jean_bon_link());
  await page.press("Enter");

  await expect(page).toHaveTitle(
    "Modération a traiter de Jean Bon pour 51935970700022",
  );
});
