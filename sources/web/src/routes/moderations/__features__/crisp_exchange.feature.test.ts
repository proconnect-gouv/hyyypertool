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

    I.see(
      "[ProConnect] Demande pour rejoindre Direction interministerielle du numerique (DINUM)",
    );
    I.see("#jean_di");
    I.see("A résolu la conversation");
    I.see("a écrit cette note privée");
    I.dontSee("Message 24");
    I.see("Afficher les messages précédents");

    I.click("Afficher les messages précédents");
    I.see("Message 24");
    I.dontSee("Message 15");

    I.click("Afficher les messages précédents");
    I.see("Message 15");
    I.dontSee("Message 03");

    I.click("Afficher les messages précédents");
    I.see("Message 03");
    I.dontSee("Message 01");

    I.click("Afficher les messages précédents");
    I.see("Message 01");
    I.dontSee("Afficher les messages précédents");
  },
);

Scenario("Le modérateur répond dans les échanges Crisp", ({ I }) => {
  beforeAll(async () => {
    await empty_databases();
    await insert_database(pg);
    await insert_moderateur(hyyyper_pglite);
  });

  I.amOnPage("/moderations");
  I.click("Modération a traiter de Jean Bon pour 13002526500013");
  I.click("Échanges entre Jean et nous");
  I.dontSee("Réponse envoyée depuis la modération");

  I.fillField("Répondre à l'usager…", "Réponse envoyée depuis la modération");
  I.click({ role: "button", name: "Envoyer" });
  I.see("Réponse envoyée depuis la modération");
});

Scenario("Le modérateur résout puis rouvre la conversation Crisp", ({ I }) => {
  beforeAll(async () => {
    await empty_databases();
    await insert_database(pg);
    await insert_moderateur(hyyyper_pglite);
  });

  I.amOnPage("/moderations");
  I.click("Modération a traiter de Jean Bon pour 13002526500013");
  I.click("Échanges entre Jean et nous");
  I.dontSeeElement({ role: "button", name: "Résolue" });

  I.click({ role: "button", name: "Non résolue" });
  I.seeElement({ role: "button", name: "Résolue" });

  I.click({ role: "button", name: "Résolue" });
  I.seeElement({ role: "button", name: "Non résolue" });
});

Scenario(
  "Le modérateur envoie et résout depuis les échanges Crisp",
  ({ I }) => {
    beforeAll(async () => {
      await empty_databases();
      await insert_database(pg);
      await insert_moderateur(hyyyper_pglite);
    });

    I.amOnPage("/moderations");
    I.click("Modération a traiter de Jean Bon pour 13002526500013");
    I.click("Échanges entre Jean et nous");

    I.fillField("Répondre à l'usager…", "Réponse avant résolution");
    I.click("~Plus d'options d'envoi");
    I.click("~Envoyer et résoudre");
    I.see("Réponse avant résolution");
    I.seeElement({ role: "button", name: "Résolue" });
  },
);
