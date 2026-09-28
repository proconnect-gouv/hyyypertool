import {
  base_url,
  expect,
  expect_table_contains,
  getByRole,
  getByText,
  named_table_rows,
  page,
  search_moderations,
  setup_feature_test,
  test,
} from "#src/testing";

//

setup_feature_test();

//

test("Marie Bon à rejoindre l'organisation Bosch par erreur", async () => {
  const marie_moderation_link = getByRole("link", {
    name: "Modération non vérifié de Marie Bon pour 44023386400014",
  });

  await page.navigate(`${base_url}/moderations`);
  await search_moderations(
    "is:processed date:2011-11-12",
    marie_moderation_link,
  );
  await marie_moderation_link.click();
  await expect(page).toHaveTitle(
    "Modération non vérifié de Marie Bon pour 44023386400014",
  );

  await expect(
    getByText("Cette modération a été marqué comme traité"),
  ).toBeVisible();
  await expect(
    getByText(
      "Marie Bon a rejoint une organisation avec un domain non vérifié « Bosch rexroth d.s.i. »",
    ),
  ).toBeVisible();

  // An htmx button: a click landing before htmx processes it sends nothing,
  // and once the reprocess lands the button is gone, so only re-click it
  // while it's still there
  const reprocess_button = getByRole("button", { name: "Retraiter" });
  await expect(async () => {
    if (await reprocess_button.isVisible()) await reprocess_button.click();
    await expect(
      getByText("Cette modération a été marqué comme traité"),
    ).not.toBeVisible({ timeout: 2_000 });
  }).toPass();

  await getByText("👥 0 membre connu dans l’organisation").click();
  expect_table_contains(
    await named_table_rows("👥 0 membre connu dans l’organisation"),
    [[""]],
  );
});
