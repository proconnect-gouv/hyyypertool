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
  "Moderator can see the user details",
  Scenario(
    () => `http://localhost:${server.port}`,
    ({ I }) => {
      I.navigate("/moderations");
      I.see("Liste des moderations");
      I.click_link("Modération a traiter de Jean Bon pour 13002526500013");
      I.see("jeanbon@yopmail.com");
    },
  ),
);

describe(
  "Moderator can see the user's organizations",
  Scenario(
    () => `http://localhost:${server.port}`,
    ({ I }) => {
      I.navigate("/moderations");
      I.click_link("Modération a traiter de Jean Bon pour 13002526500013");
      I.see("organisation connu");
    },
  ),
);

describe(
  "Moderator can see the target organization's members",
  Scenario(
    () => `http://localhost:${server.port}`,
    ({ I }) => {
      I.navigate("/moderations");
      I.click_link("Modération a traiter de Jean Bon pour 13002526500013");
      I.see("membre connu");
    },
  ),
);

describe(
  "Moderator can go back to the list",
  Scenario(
    () => `http://localhost:${server.port}`,
    ({ I }) => {
      I.navigate("/moderations");
      I.click_link("Modération a traiter de Jean Bon pour 13002526500013");
      I.see("jeanbon@yopmail.com");
      I.click("retour");
      I.see_in_title("Liste des moderations");
    },
  ),
);
