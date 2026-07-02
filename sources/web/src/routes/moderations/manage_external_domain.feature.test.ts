import { create_testing_router } from "#src/testing";
import {
  hyyyper_pglite,
  empty_database as hyyyperbase_empty_database,
} from "@~/hyyyperbase/testing";
import { insert_moderateur } from "@~/hyyyperbase/testing/users";
import { insert_database } from "@~/identite-proconnect/database/seed/insert";
import {
  empty_database as identite_empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/database/testing";
import { Scenario } from "bun-webview-dsl";
import { afterAll, beforeAll, beforeEach, describe } from "bun:test";

//

let server: ReturnType<typeof Bun.serve>;
beforeAll(migrate);
beforeAll(() => {
  server = Bun.serve({ fetch: create_testing_router().fetch, port: 0 });
});
afterAll(() => server.stop(true));
beforeEach(identite_empty_database);
beforeEach(hyyyperbase_empty_database);
beforeEach(() => insert_database(pg));
beforeEach(() => insert_moderateur(hyyyper_pglite));

//
describe(
  "Domaine externe",
  Scenario(
    () => `http://localhost:${server.port}`,
    ({ I, within }) => {
      I.navigate("/moderations");
      I.see("Liste des moderations");
      I.click_link("Modération a traiter de Jean Bon pour 51935970700022");
      I.see_in_title("Modération a traiter de Jean Bon pour 51935970700022");
      I.click("🌐 1 domaine connu dans l’organisation");
      within("🌐 1 domaine connu dans l’organisation", (in_domain_section) => {
        in_domain_section.I.see("yopmail.com");
      });
      I.click("Menu");
      I.click("❎ Domaine externe");
      within("🌐 1 domaine connu dans l’organisation", (in_domain_section) => {
        in_domain_section.I.see("❎");
      });
    },
  ),
);
