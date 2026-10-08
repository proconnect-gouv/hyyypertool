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
  "Les boutons copier sont toujours visibles après un clic sur Rafraichir",
  ({ I }) => {
    I.amOnPage("/moderations");
    I.see("Liste des moderations");

    I.click("Domaines à vérifier");
    I.see("Liste des domaines à vérifier");
    I.within("~Domaine non vérifié yeswehack.com pour Yes we hack", () => {
      I.seeElement({ role: "button", name: "Copier le nom de domaine" });
    });

    I.click("Rafraichir");
    I.see("Liste des domaines à vérifier");
    I.within("~Domaine non vérifié yeswehack.com pour Yes we hack", () => {
      I.seeElement({ role: "button", name: "Copier le nom de domaine" });
    });
  },
);
