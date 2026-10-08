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

Scenario("Le modérateur voit le titre de la page", ({ I }) => {
  I.amOnPage("/response-templates");
  I.see("Templates de réponse");
});

Scenario(
  "Le modérateur voit le lien pour créer un nouveau template",
  ({ I }) => {
    I.amOnPage("/response-templates");
    I.seeElement({ role: "link", name: "Nouveau template" });
  },
);

Scenario(
  "Le modérateur peut naviguer vers la création d'un template",
  ({ I }) => {
    I.amOnPage("/response-templates");
    I.click({ role: "link", name: "Nouveau template" });
    I.seeTitleEquals("Nouveau template");
  },
);
