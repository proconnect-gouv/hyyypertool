import {
  base_url,
  expect,
  expect_table_contains,
  getByPlaceholder,
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

async function expect_domains(expected: string[][]) {
  await expect(async () =>
    expect_table_contains(await named_table_rows(domains_table), expected),
  ).toPass();
}

test("Domaine interne", async () => {
  await page.navigate(`${base_url}/moderations`);
  await getByRole("link", {
    name: "Modération a traiter de Jean Bon pour 51935970700022",
  }).click();
  await expect(page).toHaveTitle(
    "Modération a traiter de Jean Bon pour 51935970700022",
  );
  await getByText(domains_table).click();

  await expect_domains([
    ["Domain", "Status", "Type"],
    ["yopmail.com", "❓", "not_verified_yet"],
  ]);

  // The table holds a single row, so its menu is the only one on the page
  await getByRole("button", { name: "Menu" }).click();
  await getByRole("button", { name: "✅ Domaine autorisé" }).click();
  await expect_domains([
    ["Domain", "Status", "Type"],
    ["yopmail.com", "✅", "verified"],
  ]);

  await getByRole("button", { name: "Menu" }).click();
  await getByRole("button", { name: "🚫 Domaine refusé" }).click();
  await expect_domains([
    ["Domain", "Status", "Type"],
    ["yopmail.com", "🚫", "refused"],
  ]);

  await getByPlaceholder("Ajouter un domain").fill("poymail.com");
  await page.press("Enter");

  await expect(getByText("poymail.com")).toBeVisible();
  await expect_domains([
    ["Domain", "Status", "Type"],
    ["poymail.com", "✅", "verified"],
  ]);
});
