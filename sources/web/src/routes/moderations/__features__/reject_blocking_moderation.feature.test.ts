import { empty_databases, start_app, stop_app } from "#src/testing";
import { hyyyper_pglite } from "@~/hyyyperbase/testing";
import {
  insert_central_administration_response,
  insert_domain_name_not_found_response,
} from "@~/hyyyperbase/testing/response_templates";
import { insert_moderateur } from "@~/hyyyperbase/testing/users";
import { insert_database } from "@~/identite-proconnect/database/seed/insert";
import { pg } from "@~/identite-proconnect/database/testing";
import { afterAll, beforeAll } from "bun:test";
import { Scenario } from "buncept";

//

beforeAll(start_app);
afterAll(stop_app);

//

Scenario("Le modérateur le refuse avec la barre d'outils", ({ I }) => {
  beforeAll(async () => {
    await empty_databases();
    await insert_database(pg);
    await insert_moderateur(hyyyper_pglite);
    await insert_central_administration_response(hyyyper_pglite);
    await insert_domain_name_not_found_response(hyyyper_pglite);
  });

  I.amOnPage("/moderations");
  I.see("Liste des moderations");
  I.fillField("Filtrer les modérations…", "is:pending date:2011-11-11");
  I.pressKey("Enter");
  I.click("Modération a traiter de Jean Bon pour 13002526500013");
  I.seeTitleEquals("Modération a traiter de Jean Bon pour 13002526500013");

  I.click("❌ Refuser");
  I.see("Motif de refus :");

  I.within("la modale de refus", () => {
    I.fillField("Recherche d'une réponse type", "Nom de domaine introuvable");
    I.pressKey("Enter");
    I.see(
      "⚠️ Attention, cette réponse type autorise l'utilisateur à éditer ses informations personnelles.",
    );
    I.see("Motif transmis à l'utilisateur :");

    I.click("Notifier et terminer");
  });

  I.click("Annuler");
  I.see("Modération rejetée");
  I.see("Cette modération a été marqué comme traitée le");

  I.click("Moderations");
  I.seeTitleEquals("Liste des moderations");
  I.see("Liste des moderations");
  I.dontSee("13002526500013");
});

Scenario(
  "Le warning ne s'affiche pas quand le template n'autorise pas l'édition",
  ({ I }) => {
    beforeAll(async () => {
      await empty_databases();
      await insert_database(pg);
      await insert_moderateur(hyyyper_pglite);
      await insert_central_administration_response(hyyyper_pglite);
      await insert_domain_name_not_found_response(hyyyper_pglite);
    });

    I.amOnPage("/moderations");
    I.see("Liste des moderations");
    I.fillField("Filtrer les modérations…", "is:pending date:2011-11-11");
    I.pressKey("Enter");
    I.click("Modération a traiter de Jean Bon pour 13002526500013");
    I.seeTitleEquals("Modération a traiter de Jean Bon pour 13002526500013");

    I.click("❌ Refuser");

    I.within("la modale de refus", () => {
      I.fillField(
        "Recherche d'une réponse type",
        "Agent - adresse e-mail départementale —> Admin centrale",
      );
      I.pressKey("Enter");
      I.dontSee(
        "⚠️ Attention, cette réponse type autorise l'utilisateur à éditer ses informations personnelles.",
      );
      I.see("Motif transmis à l'utilisateur :");
    });
  },
);
