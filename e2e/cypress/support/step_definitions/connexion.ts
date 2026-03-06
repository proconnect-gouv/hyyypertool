//
// Sentence description heavily inspired by UVV
// https://e2e-test-quest.github.io/uuv/fr/docs/wordings/generated-wording-description/fr-generated-wording-description/
//

import { When } from "@badeball/cypress-cucumber-preprocessor";

//

When("je me connecte en tant que {string}", (email: string) => {
  cy.contains("button", "ProConnect").click();
  cy.contains("button", email).click();
});
