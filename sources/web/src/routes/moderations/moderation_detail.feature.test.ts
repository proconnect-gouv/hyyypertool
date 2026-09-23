import {
  base_url,
  expect,
  getByRole,
  getByText,
  page,
  setup_feature_test,
  test,
} from "#src/testing";
import { beforeEach } from "bun:test";

//

setup_feature_test();

beforeEach(async () => {
  await page.navigate(`${base_url}/moderations`);
  await getByRole("link", {
    name: "Modération a traiter de Jean Bon pour 13002526500013",
  }).click();
  await expect(page).toHaveTitle(
    "Modération a traiter de Jean Bon pour 13002526500013",
  );
});

//

test("Le modérateur peut voir les détails de l'utilisateur", async () => {
  await expect(getByText("jeanbon@yopmail.com")).toBeVisible();
});

test("Le modérateur peut voir les organisations de l'utilisateur", async () => {
  await expect(getByText("organisation connu")).toBeVisible();
});

test("Le modérateur peut voir les membres de l'organisation cible", async () => {
  await expect(getByText("membre connu")).toBeVisible();
});

test("Le modérateur peut revenir à la liste", async () => {
  await getByText("retour").click();
  await expect(page).toHaveTitle("Liste des moderations");
});
