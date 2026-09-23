import {
  base_url,
  expect,
  expect_table_contains,
  getByRole,
  getByText,
  named_table_rows,
  page,
  setup_feature_test,
  test,
} from "#src/testing";

//

setup_feature_test();

//

const domains_table = "🌐 1 domaine connu dans l’organisation";

test("Domaine externe", async () => {
  await page.navigate(`${base_url}/moderations`);
  await getByRole("link", {
    name: "Modération a traiter de Jean Bon pour 51935970700022",
  }).click();
  await expect(page).toHaveTitle(
    "Modération a traiter de Jean Bon pour 51935970700022",
  );
  await getByText(domains_table).click();

  expect_table_contains(await named_table_rows(domains_table), [
    ["yopmail.com"],
  ]);

  await getByText("Menu").click();
  await getByRole("button", { name: "❎ Domaine externe" }).click();

  await expect(async () =>
    expect_table_contains(await named_table_rows(domains_table), [
      ["yopmail.com", "❎"],
    ]),
  ).toPass();
});
