import { setup_scenarios } from "#src/testing";
import { Scenario } from "buncept";

//

setup_scenarios();

//

const RICHARD = "Modération a traiter de Richard Bon pour 38514019900014";

Scenario(
  "Richard Bon veut rejoindre l'organisation Dengi - Leclerc",
  ({ I }) => {
    I.amOnPage("/moderations");
    I.see("Liste des moderations");
    I.click(RICHARD);
    I.seeTitleEquals(RICHARD);

    I.see("Richard Bon veut rejoindre l'organisation « Dengi - Leclerc »");
    I.see("Attention : demande multiples");
    I.see("Il s'agit de la 2e demande pour cette organisation");
    // The status badges are styled uppercase: this is the text on screen
    I.see("Moderation#5 ACCEPTÉ");
    I.see("Moderation#6 A TRAITER");
  },
);
