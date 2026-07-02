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
import { create_testing_router } from "#src/testing";
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
  "Moderator can search a moderation by email",
  Scenario(
    () => `http://localhost:${server.port}`,
    ({ I }) => {
      I.navigate("/moderations");
      I.see("Liste des moderations");
      I.see("Richard");
      I.fill("Filtrer les modérations…", "is:pending email:jeanbon");
      I.see("13002526500013");
      I.not_see("Raphael");
    },
  ),
);

describe(
  "Moderator can search a moderation by SIRET",
  Scenario(
    () => `http://localhost:${server.port}`,
    ({ I }) => {
      I.navigate("/moderations");
      I.see("Liste des moderations");
      I.see("Richard");
      I.fill("Filtrer les modérations…", "is:pending siret:51935970700022");
      I.see("51935970700022");
      I.not_see("Raphael");
    },
  ),
);

describe(
  "Moderator can explore a moderation from the list",
  Scenario(
    () => `http://localhost:${server.port}`,
    ({ I }) => {
      I.navigate("/moderations");
      I.see("Liste des moderations");
      I.see("Richard");
      I.click_link("Modération a traiter de Jean Bon pour 13002526500013");
      I.see_in_title("Modération a traiter de Jean Bon pour 13002526500013");
      I.see("jeanbon@yopmail.com");
    },
  ),
);
