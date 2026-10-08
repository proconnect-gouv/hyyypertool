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
  "Moderator can accept a blocking moderation with the toolbar",
  ({ I }) => {
    I.amOnPage("/moderations");
    I.seeTitleEquals("Liste des moderations");
    I.click("Modération a traiter de Jean Bon pour 13002526500013");

    I.seeTitleEquals("Modération a traiter de Jean Bon pour 13002526500013");
    I.see("jeanbon@yopmail.com");

    I.click("✅ Accepter");
    I.see(
      "A propos de jeanbon@yopmail.com pour l'organisation Direction interministerielle du numerique (DINUM), je valide :",
    );
    I.within("la modale de validation", () => {
      I.click("Terminer");
    });
    I.click("Annuler");

    I.see("Modération acceptée");
    I.see("Cette modération a été marqué comme traitée le");
    I.see("Validé par moderateur@beta.gouv.fr");

    I.click("Moderations");
    I.seeTitleEquals("Liste des moderations");
    I.dontSee("13002526500013");

    I.fillField("Filtrer les modérations…", "is:processed");
    I.pressKey("Enter");
    I.click("Modération a traiter de Jean Bon pour 13002526500013");

    I.seeTitleEquals("Modération a traiter de Jean Bon pour 13002526500013");
  },
);
