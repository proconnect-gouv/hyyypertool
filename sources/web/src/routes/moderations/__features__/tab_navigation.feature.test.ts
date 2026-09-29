import { setup_scenarios } from "#src/testing";
import { Scenario, type Actor } from "buncept";

//

setup_scenarios();

//

const JEAN_BON = "Modération a traiter de Jean Bon pour 51935970700022";

// Cucumber's "Contexte", then the skip link every scenario starts from
function background(I: Actor) {
  I.amOnPage("/moderations");
  I.see("Liste des moderations");
  I.pressKey("Tab");
  I.seeFocused("Aller au contenu principal");
  I.pressKey("Enter");
}

//

Scenario(
  "Naviguer au clavier depuis le haut de la page jusqu'aux rangées du tableau",
  ({ I }) => {
    background(I);
    I.pressKeyUntilFocused("Tab", JEAN_BON);
    I.seeFocused(JEAN_BON);
    I.pressKey("Tab");
    I.seeFocused("Modération a traiter de Jean Dré pour 51935970700022");
  },
);

Scenario("Naviguer vers une modération avec le clavier", ({ I }) => {
  background(I);
  I.pressKeyUntilFocused("Tab", JEAN_BON);
  I.pressKey("Enter");
  I.seeTitleEquals(JEAN_BON);
});
