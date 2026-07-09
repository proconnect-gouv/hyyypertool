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
  "Richard Bon veut rejoindre l'organisation Dengi - Leclerc",
  Scenario(
    () => `http://localhost:${server.port}`,
    ({ I }) => {
      I.navigate("/moderations");
      I.see("Liste des moderations");
      I.click_link("Modération a traiter de Richard Bon pour 38514019900014");
      I.see_in_title("Modération a traiter de Richard Bon pour 38514019900014");
      I.see("Richard Bon veut rejoindre l'organisation « Dengi - Leclerc »");
      I.see("Attention : demande multiples");
      I.see("Il s'agit de la 2e demande pour cette organisation");
      I.see("Moderation#5 Accepté");
      I.see("Moderation#6 A traiter");
    },
  ),
);
