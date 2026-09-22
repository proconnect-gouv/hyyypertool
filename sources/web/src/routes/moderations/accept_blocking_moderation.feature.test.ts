import {
  base_url,
  expect,
  getByLabel,
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

const moderation_link = () =>
  getByRole("link", {
    name: "Modération a traiter de Jean Bon pour 13002526500013",
  });

test("Moderator can accept a blocking moderation with the toolbar", async () => {
  await page.navigate(`${base_url}/moderations`);
  await expect(page).toHaveTitle("Liste des moderations");

  await moderation_link().click();

  await expect(page).toHaveTitle(
    "Modération a traiter de Jean Bon pour 13002526500013",
  );
  await expect(getByText("jeanbon@yopmail.com")).toBeVisible();

  await getByRole("button", { name: "✅ Accepter" }).click();

  await expect(getByLabel("la modale de validation")).toBeVisible();
  await expect(
    getByText(
      "A propos de jeanbon@yopmail.com pour l'organisation Direction interministerielle du numerique (DINUM), je valide :",
    ),
  ).toBeVisible();

  await getByRole("button", { name: "Terminer" }).click();
  await getByRole("button", { name: "Annuler" }).click();

  await expect(getByText("Modération acceptée")).toBeVisible();
  await expect(
    getByText("Cette modération a été marqué comme traitée le"),
  ).toBeVisible();
  await expect(getByText("Validé par moderateur@beta.gouv.fr")).toBeVisible();

  await getByRole("link", { name: "Moderations" }).click();

  await expect(page).toHaveTitle("Liste des moderations");
  await expect(getByText("13002526500013")).not.toBeVisible();

  await search_moderations("is:processed", moderation_link());

  await moderation_link().click();

  await expect(page).toHaveTitle(
    "Modération a traiter de Jean Bon pour 13002526500013",
  );
});
