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

Scenario("Afficher la liste des domaines en whitelist", ({ I }) => {
  beforeAll(async () => {
    await empty_databases();
    await insert_database(pg);
    await insert_moderateur(hyyyper_pglite);
  });

  I.amOnPage("/moderations");
  I.click("Délivrabilité des domaines");
  I.seeInCurrentUrl("/domains-deliverability");
  I.seeTitleEquals("Délivrabilité des domaines");
  I.see("test@ch-lehavre.fr");
  I.see("ch-lehavre.fr");
  I.see("test@ccduserein.fr");
  I.see("ccduserein.fr");
});

Scenario("Ajouter un nouveau domaine à la whitelist", ({ I }) => {
  beforeAll(async () => {
    await empty_databases();
    await insert_database(pg);
    await insert_moderateur(hyyyper_pglite);
  });

  I.amOnPage("/moderations");
  I.click("Délivrabilité des domaines");
  I.seeInCurrentUrl("/domains-deliverability");
  I.fillField("Ajouter un email problématique", "nouveau@example.fr");
  I.click({ role: "button", name: "Ajouter" });
  I.see("nouveau@example.fr");
  I.see("example.fr");
});

Scenario("Supprimer un domaine de la whitelist", ({ I }) => {
  beforeAll(async () => {
    await empty_databases();
    await insert_database(pg);
    await insert_moderateur(hyyyper_pglite);
  });

  I.amAcceptingPopups();
  I.amOnPage("/moderations");
  I.click("Délivrabilité des domaines");
  I.seeInCurrentUrl("/domains-deliverability");
  I.see("test@ch-lehavre.fr");
  I.click({ role: "button", name: "Supprimer test@ch-lehavre.fr" });
  I.dontSee("test@ch-lehavre.fr");
});

Scenario("Vérifier les informations de vérification", ({ I }) => {
  beforeAll(async () => {
    await empty_databases();
    await insert_database(pg);
    await insert_moderateur(hyyyper_pglite);
  });

  I.amOnPage("/moderations");
  I.click("Délivrabilité des domaines");
  I.seeInCurrentUrl("/domains-deliverability");
  I.see("🧟‍♂️ zombie admin");
  I.see("01/01/2024");
});
