import { empty_databases, start_app, stop_app } from "#src/testing";
import { hyyyper_pglite } from "@~/hyyyperbase/testing";
import { insert_moderateur } from "@~/hyyyperbase/testing/users";
import { insert_database } from "@~/identite-proconnect/database/seed/insert";
import { pg } from "@~/identite-proconnect/database/testing";
import { afterAll, beforeAll } from "bun:test";
import { Scenario } from "buncept";

//

beforeAll(start_app);
afterAll(stop_app);

//

Scenario(
  "Le modérateur consulte les échanges Crisp d'une modération",
  ({ I }) => {
    beforeAll(async () => {
      await empty_databases();
      await insert_database(pg);
      await insert_moderateur(hyyyper_pglite);
    });

    I.amOnPage("/moderations");
    I.click("Modération a traiter de Jean Bon pour 13002526500013");
    I.click("Échanges entre Jean et nous");

    I.see("Conversation de test");
    I.see("Message 4");
    I.see("Afficher plus de messages");
    I.see("Consulter tous les messages sur Crisp");
  },
);
