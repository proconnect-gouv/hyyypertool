import { setup_scenarios } from "#src/testing";
import { Scenario } from "buncept";

//

setup_scenarios();

//

Scenario(
  "Les boutons copier sont toujours visibles après un clic sur Rafraichir",
  ({ I }) => {
    I.amOnPage("/moderations");
    I.see("Liste des moderations");

    I.click("Domaines à vérifier");
    I.see("Liste des domaines à vérifier");
    I.within("~Domaine non vérifié yeswehack.com pour Yes we hack", () => {
      I.seeElement({ css: 'button[title="Copier le nom de domaine"]' });
    });

    I.click("Rafraichir");
    I.see("Liste des domaines à vérifier");
    I.within("~Domaine non vérifié yeswehack.com pour Yes we hack", () => {
      I.seeElement({ css: 'button[title="Copier le nom de domaine"]' });
    });
  },
);
