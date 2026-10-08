import { setup_scenarios } from "#src/testing";
import { Scenario } from "buncept";

//

setup_scenarios();

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
