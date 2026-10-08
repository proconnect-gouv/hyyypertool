import { setup_scenarios } from "#src/testing";
import { Scenario } from "buncept";

//

setup_scenarios();

//

const PIERRE = "Modération big organisation de Pierre Bon pour 81797266400038";

Scenario("Pierre Bon veut rejoindre l'association ALDP", ({ I }) => {
  I.amOnPage("/moderations");
  I.see("Liste des moderations");
  I.click(PIERRE);
  I.seeTitleEquals(PIERRE);

  I.see(
    "Pierre Bon a rejoint l'organisation de plus de 50 employés « Association des loisirs de la diversite et du partage (ALDP) »",
  );
  I.see("Liste dirigeants - Annuaire entreprise API");
});
