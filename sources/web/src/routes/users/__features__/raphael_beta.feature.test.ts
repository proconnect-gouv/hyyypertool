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

Scenario("La fiche de Raphael Beta", ({ I }) => {
  I.amOnPage("/moderations");
  I.click({ role: "link", name: "Utilisateurs" });
  I.seeTitleEquals("Liste des utilisateurs");
  I.see("Liste des utilisateurs");
  I.click({
    role: "link",
    name: "Utilisateur Raphael Dubigny (rdubigny@beta.gouv.fr)",
  });
  I.seeTitleEquals("Utilisateur Raphael Dubigny (rdubigny@beta.gouv.fr)");

  I.see("👨‍💻 A propos de l'utilisateur");
  I.see("« Raphael Dubigny »");
  I.see("EMAIL rdubigny@beta.gouv.fr");
  I.see("PRÉNOM Raphael");
  I.see("NOM Dubigny");
  I.see("TÉLÉPHONE 0123456789");
  I.see("CRÉATION 13/07/2018 17:35:15");
  I.see("DERNIÈRE MODIFICATION 22/06/2023 16:34:34");
  I.see("EMAIL VÉRIFIÉ ENVOYÉ LE 22/06/2023 16:34:34");

  I.see("🏢 2 organisations de Raphael");
  I.click("🏢 2 organisations de Raphael");
  I.within({ row: "Libellé" }, () => {
    I.see("Siret");
    I.see("Interne");
  });
  I.within({ row: "Direction interministerielle du numerique (DINUM)" }, () => {
    I.see("13002526500013");
    I.see("✅");
  });
});
