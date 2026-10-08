import { setup_scenarios } from "#src/testing";
import { Scenario } from "buncept";

//

setup_scenarios();

//

Scenario("Le modérateur voit le titre de la page", ({ I }) => {
  I.amOnPage("/response-templates");
  I.see("Templates de réponse");
});

Scenario(
  "Le modérateur voit le lien pour créer un nouveau template",
  ({ I }) => {
    I.amOnPage("/response-templates");
    I.seeElement({ role: "link", name: "Nouveau template" });
  },
);

Scenario(
  "Le modérateur peut naviguer vers la création d'un template",
  ({ I }) => {
    I.amOnPage("/response-templates");
    I.click({ role: "link", name: "Nouveau template" });
    I.seeTitleEquals("Nouveau template");
  },
);
