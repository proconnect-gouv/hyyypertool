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
import { afterAll, beforeAll, describe } from "bun:test";

//

let server: ReturnType<typeof Bun.serve>;
beforeAll(migrate);
beforeAll(() => {
  server = Bun.serve({ fetch: create_testing_router().fetch, port: 0 });
});
afterAll(() => server.stop(true));

//

describe(
  "Retraiter une modération complétée",
  Scenario(
    () => `http://localhost:${server.port}`,
    ({ I }) => {
      beforeAll(identite_empty_database);
      beforeAll(hyyyperbase_empty_database);
      beforeAll(() => insert_database(pg));
      beforeAll(() => insert_moderateur(hyyyper_pglite));
      I.navigate("/moderations");
      I.see("Liste des moderations");
      I.fill_and_submit(
        "Filtrer les modérations…",
        "is:processed date:2011-11-12",
      );
      I.click_link("Modération non vérifié de Marie Bon pour 44023386400014");
      I.see_in_title("Modération non vérifié de Marie Bon pour 44023386400014");
      I.see("Cette modération a été marqué comme traité");
      I.see(
        "Marie Bon a rejoint une organisation avec un domain non vérifié « Bosch rexroth d.s.i. »",
      );
      I.click("Retraiter");
      I.not_see("Cette modération a été marqué comme traité");
      I.click("👥 0 membre connu dans l'organisation");
      I.see_table("👥 0 membre connu dans l'organisation", []);
    },
  ),
);
