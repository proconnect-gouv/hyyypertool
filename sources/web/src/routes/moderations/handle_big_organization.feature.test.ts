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

describe.serial(
  "Pierre Bon veut rejoindre l'association ALDP",
  Scenario(
    () => `http://localhost:${server.port}`,
    ({ I }) => {
      I.navigate("/moderations");
      I.see("Liste des moderations");
      I.click_link(
        "Modération big organisation de Pierre Bon pour 81797266400038",
      );
      I.see_in_title(
        "Modération big organisation de Pierre Bon pour 81797266400038",
      );
      I.see(
        "Pierre Bon a rejoint l'organisation de plus de 50 employés « Association des loisirs de la diversite et du partage (ALDP) »",
      );
      I.see("Liste dirigeants - Annuaire entreprise API");
    },
  ),
);
