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
  "Naviguer au clavier depuis le haut de la page jusqu'aux rangées du tableau",
  ({ I }) => {
    I.amOnPage("/moderations");
    I.see("Liste des moderations");
    I.pressKey("Tab");
    I.seeFocused("Aller au contenu principal");
    I.pressKey("Enter");

    I.pressKeyUntilFocused(
      "Tab",
      "Modération a traiter de Jean Bon pour 51935970700022",
    );
    I.seeFocused("Modération a traiter de Jean Bon pour 51935970700022");
    I.pressKey("Tab");
    I.seeFocused("Modération a traiter de Jean Dré pour 51935970700022");
  },
);

Scenario("Naviguer vers une modération avec le clavier", ({ I }) => {
  I.amOnPage("/moderations");
  I.see("Liste des moderations");
  I.pressKey("Tab");
  I.seeFocused("Aller au contenu principal");
  I.pressKey("Enter");

  I.pressKeyUntilFocused(
    "Tab",
    "Modération a traiter de Jean Bon pour 51935970700022",
  );
  I.pressKey("Enter");
  I.seeTitleEquals("Modération a traiter de Jean Bon pour 51935970700022");
});
