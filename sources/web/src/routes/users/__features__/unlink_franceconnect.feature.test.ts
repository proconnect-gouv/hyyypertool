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
  "Le modérateur délie FranceConnect et le voit dans le journal d'activité de l'utilisateur",
  ({ I }) => {
    I.amAcceptingPopups();

    I.amOnPage("/users");
    I.click({
      role: "link",
      name: "Utilisateur Raphael Dubigny (rdubigny@alpha.gouv.fr)",
    });
    I.see("fc-sub-raphael-alpha-1234567890abcdef");
    I.see("🕓 3 activités de Raphael");

    I.click("🪪 révoquer les données FranceConnect");

    I.see("L'utilisateur n'a pas de données FranceConnect.");
    I.dontSee("fc-sub-raphael-alpha-1234567890abcdef");
    I.click("🕓 4 activités de Raphael");
    I.within("~Activité franceconnect.disconnected", () => {
      I.see("FranceConnect délié");
      I.see("moderateur@beta.gouv.fr");
    });
  },
);
