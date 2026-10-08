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

Scenario(
  "Richard Bon veut rejoindre l'organisation Dengi - Leclerc",
  ({ I }) => {
    I.amOnPage("/moderations");
    I.see("Liste des moderations");
    I.click("Modération a traiter de Richard Bon pour 38514019900014");
    I.seeTitleEquals("Modération a traiter de Richard Bon pour 38514019900014");

    I.see("Richard Bon veut rejoindre l'organisation « Dengi - Leclerc »");
    I.see("Attention : demande multiples");
    I.see("Il s'agit de la 2e demande pour cette organisation");
    // The status badges are styled uppercase: this is the text on screen
    I.see("Moderation#5 ACCEPTÉ");
    I.see("Moderation#6 A TRAITER");
  },
);
