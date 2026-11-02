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

Scenario("Le journal d'activité passe à la page suivante", ({ I }) => {
  I.amOnPage("/activity?page_size=10");
  I.see("Affiche de 1-10 sur 12");

  I.click("Suivant");
  I.see("Affiche de 11-12 sur 12");
  I.seeInCurrentUrl("page=2");

  I.click("Précédent");
  I.see("Affiche de 1-10 sur 12");
  I.seeInCurrentUrl("page=1");
});

Scenario("Le journal d'activité respecte le nombre de lignes", ({ I }) => {
  I.amOnPage("/activity?page_size=5");
  I.see("Affiche de 1-5 sur 12");

  I.click("Suivant");
  I.see("Affiche de 6-10 sur 12");
  I.seeInCurrentUrl("page_size=5");
});

Scenario("Le bouton direct conserve la requête", ({ I }) => {
  I.amOnPage("/activity?page_size=5&page=2");
  I.see("Affiche de 6-10 sur 12");

  I.click("Suivre en direct");
  I.see("Affiche de 6-10 sur 12");
  I.seeInCurrentUrl("page_size=5");
  I.seeInCurrentUrl("page=2");
  I.seeInCurrentUrl("live=5");
});

Scenario(
  "Le direct conserve la page choisie dans le journal d'activité",
  ({ I }) => {
    I.amOnPage("/activity?live=1&page_size=10");
    I.see("Affiche de 1-10 sur 12");

    I.click("Suivant");
    I.see("Affiche de 11-12 sur 12");

    // htmx polls on the browser clock; wait long enough for a live refresh.
    I.wait(2);
    I.see("Affiche de 11-12 sur 12");
    I.seeInCurrentUrl("page=2");
  },
);
