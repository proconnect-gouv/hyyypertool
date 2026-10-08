import { empty_databases, start_app, stop_app } from "#src/testing";
import { hyyyper_pglite } from "@~/hyyyperbase/testing";
import { insert_moderateur } from "@~/hyyyperbase/testing/users";
import { insert_database } from "@~/identite-proconnect/database/seed/insert";
import { pg } from "@~/identite-proconnect/database/testing";
import { afterAll, beforeAll } from "bun:test";
import { Scenario } from "buncept";

//

beforeAll(start_app);
beforeAll(async () => {
  await empty_databases();
  await insert_database(pg);
  await insert_moderateur(hyyyper_pglite);
});
afterAll(stop_app);

//

Scenario("Le modérateur peut voir les détails de l'utilisateur", ({ I }) => {
  I.amOnPage("/moderations");
  I.click("Modération a traiter de Jean Bon pour 13002526500013");
  I.seeTitleEquals("Modération a traiter de Jean Bon pour 13002526500013");
  I.see("jeanbon@yopmail.com");
});

Scenario(
  "Le modérateur peut voir les organisations de l'utilisateur",
  ({ I }) => {
    I.amOnPage("/moderations");
    I.click("Modération a traiter de Jean Bon pour 13002526500013");
    I.seeTitleEquals("Modération a traiter de Jean Bon pour 13002526500013");
    I.see("organisation connu");
  },
);

Scenario(
  "Le modérateur peut voir les membres de l'organisation cible",
  ({ I }) => {
    I.amOnPage("/moderations");
    I.click("Modération a traiter de Jean Bon pour 13002526500013");
    I.seeTitleEquals("Modération a traiter de Jean Bon pour 13002526500013");
    I.see("membre connu");
  },
);

Scenario("Le modérateur peut revenir à la liste", ({ I }) => {
  I.amOnPage("/moderations");
  I.click("Modération a traiter de Jean Bon pour 13002526500013");
  I.seeTitleEquals("Modération a traiter de Jean Bon pour 13002526500013");
  I.click("retour");
  I.seeTitleEquals("Liste des moderations");
});
