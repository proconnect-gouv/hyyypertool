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

Scenario("Navigation avant et arrière dans la liste", ({ I }) => {
  I.amOnPage("/organizations?page_size=1&page=4");
  I.see("Yes we hack");
  I.click("Suivant");
  I.see("Abracadabra (ABRACADABRA)");
  I.seeInCurrentUrl("page=5");
  I.click("Précédent");
  I.see("Yes we hack");
  I.seeInCurrentUrl("page=4");
});
