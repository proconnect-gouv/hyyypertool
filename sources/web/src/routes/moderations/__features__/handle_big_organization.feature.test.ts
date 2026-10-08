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

Scenario("Pierre Bon veut rejoindre l'association ALDP", ({ I }) => {
  I.amOnPage("/moderations");
  I.see("Liste des moderations");
  I.click("Modération big organisation de Pierre Bon pour 81797266400038");
  I.seeTitleEquals(
    "Modération big organisation de Pierre Bon pour 81797266400038",
  );

  I.see(
    "Pierre Bon a rejoint l'organisation de plus de 50 employés « Association des loisirs de la diversite et du partage (ALDP) »",
  );
  I.see("Liste dirigeants - Annuaire entreprise API");
});
