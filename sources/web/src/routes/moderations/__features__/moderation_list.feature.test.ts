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

Scenario("Moderator can search a moderation by email", ({ I }) => {
  I.amOnPage("/moderations");
  I.see("Liste des moderations");
  I.see("Richard");

  I.fillField("Filtrer les modérations…", "is:pending email:jeanbon");
  I.pressKey("Enter");

  I.see("13002526500013");
  I.dontSee("Raphael");
});

Scenario("Moderator can search a moderation by SIRET", ({ I }) => {
  I.amOnPage("/moderations");
  I.see("Liste des moderations");
  I.see("Richard");

  I.fillField("Filtrer les modérations…", "is:pending siret:51935970700022");
  I.pressKey("Enter");

  I.see("51935970700022");
  I.dontSee("Raphael");
});

Scenario("Moderator can explore a moderation from the list", ({ I }) => {
  I.amOnPage("/moderations");
  I.see("Liste des moderations");
  I.see("Richard");

  I.click("Modération a traiter de Jean Bon pour 13002526500013");

  I.seeTitleEquals("Modération a traiter de Jean Bon pour 13002526500013");
  I.see("jeanbon@yopmail.com");
});
