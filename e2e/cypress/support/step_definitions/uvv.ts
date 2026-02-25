//
// Sentence description heavily inspired by UVV
// https://e2e-test-quest.github.io/uuv/fr/docs/wordings/generated-wording-description/fr-generated-wording-description/
//

import {
  Before,
  Given,
  Then,
  When,
  type DataTable,
} from "@badeball/cypress-cucumber-preprocessor";
import "@testing-library/cypress/add-commands";

//

/**
 * Returns the current context to scope all subsequent cy commands within this element.
 * Useful when working within a particular group of elements such as a <form>.
 * Similar to uuvGetContext(): Cypress.Chainable<Context>
 */
export let get_within_context: () => Cypress.Chainable<JQuery<HTMLElement>>;

/**
 * Sets the current context for domain-specific step definitions
 */
export const set_within_context = (
  context: () => Cypress.Chainable<JQuery<HTMLElement>>,
) => {
  get_within_context = context;
};

Before(() => {
  get_within_context = () => cy.get("body");
});

// Context management

Given("je vais à l'intérieur du dialogue nommé {string}", (text: string) => {
  get_within_context = () => cy.findAllByLabelText(text);
});

Given("je vais à l'intérieur de l'élément nommé {string}", (title: string) => {
  cy.contains(title)
    .invoke("attr", "id")
    .then((id) => {
      get_within_context = () => cy.get(`[aria-describedby="${id}"]`);
    });
});

Given("je vais à l'intérieur de la rangée nommée {string}", (name: string) => {
  get_within_context = () => cy.get(`tr[aria-label*="${name}"]`);
});

// Navigation
Given("je suis sur la page {string}", (path: string) => {
  cy.visit(path);
});

Given("je navigue sur la page", () => {
  cy.visit("/");
});

// Actions

When("je réinitialise le contexte", () => {
  get_within_context = () => cy.get("body");
});

When("je clique sur {string}", (text: string) => {
  get_within_context().within(() => cy.contains(text).click());
});

When("je clique sur le bouton {string}", (text: string) => {
  cy.contains("button", text).click();
});

When("je clique sur le bouton nommé {string}", (text: string) => {
  get_within_context().within(() => cy.contains("button", text).click());
});

When("je clique sur le lien nommé {string}", (text: string) => {
  get_within_context().within(() => cy.contains("a", text).click());
});

When(
  "je saisie {string} dans le champ nommé {string}",
  (text: string, name: string) => {
    get_within_context().within(() => cy.findByLabelText(name).type(text));
  },
);

When(
  "je saisie le mot {string} dans la boîte à texte nommée {string}",
  (text: string, name: string) => {
    get_within_context().within(() =>
      cy.get(`input[placeholder="${name}"]`).type(text),
    );
  },
);

When("je tape {string}", (text: string) => {
  cy.focused().type(text);
});

When("je retire le focus", () => {
  cy.focused().blur();
});

// Assertions
Then("je vois {string}", (text: string) => {
  get_within_context().within(() => {
    cy.contains(text, { timeout: 8_000 }).should("be.visible");
  });
});

Then("je dois voir le texte {string}", (text: string) => {
  get_within_context().within(() => cy.contains(text).should("be.visible"));
});

Then("je ne vois pas {string}", (text: string) => {
  get_within_context().within(() => cy.contains(text).should("not.exist"));
});

Then("je suis redirigé vers {string}", (path: string) => {
  cy.url().should("contain", path);
});

Then("je suis redirigé sur {string}", (path: string) => {
  cy.url().should("contain", path);
});

Then("je dois voir le titre de page {string}", (title: string) => {
  cy.title().should("contain", title);
});

// UVV-style table verification - enhanced subset matching
// see https://github.com/e2e-test-quest/uuv/blob/2d5b64b02a1bdc9602b96a9a0185f1cd071dcec6/packages/runner-cypress/src/cucumber/step_definitions/cypress/_.common.ts#L74-L87
Then(
  "je dois voir un tableau nommé {string} et contenant",
  (tableName: string, expectedData: DataTable) => {
    cy.contains(tableName)
      .invoke("attr", "id")
      .then((id) => {
        cy.get(`[aria-describedby="${id}"]`).within(() => {
          const expectedTable = expectedData.rows();
          const actualTableContent: string[][] = [];

          // Extract actual table content
          cy.get("tr").then(($rows) => {
            $rows.each((index, row) => {
              const $row = Cypress.$(row);
              const cellSelector = index === 0 ? "th" : "td";
              const $cells = $row.find(cellSelector);
              const rowData: string[] = [];

              $cells.each((_cellIndex, cell) => {
                const cellText = Cypress.$(cell).text().trim();
                rowData.push(cellText);
              });

              if (rowData.length > 0) {
                actualTableContent.push(rowData);
              }
            });

            // Verify that expected subset exists within actual table
            expectedTable.forEach((expectedRow) => {
              if (expectedRow.some((cell) => cell.trim())) {
                // Find matching rows in actual table
                const matchingRows = actualTableContent.filter((actualRow) => {
                  return expectedRow.every((expectedCell) => {
                    if (!expectedCell.trim()) return true; // Skip empty expected cells

                    // Check if any cell in this row contains the expected content
                    return actualRow.some((actualCell) =>
                      actualCell.includes(expectedCell.trim()),
                    );
                  });
                });

                expect(matchingRows.length).to.be.greaterThan(
                  0,
                  `Expected row ${JSON.stringify(expectedRow)} not found as subset in table. Actual table: ${JSON.stringify(actualTableContent)}`,
                );
              }
            });
          });
        });
      });
  },
);

When("je clique sur l'élément nommé {string}", (ariaLabel: string) => {
  get_within_context().within(() => cy.findByLabelText(ariaLabel).click());
});

Then("je vois un bouton intitulé {string}", (title: string) => {
  get_within_context().within(() =>
    cy.get(`button[title="${title}"]`).should("exist"),
  );
});

When("je confirme la suppression", () => {
  cy.on("window:confirm", () => true);
});

When(
  "je sélectionne {string} dans la liste déroulante nommée {string}",
  (value: string, label: string) => {
    get_within_context().within(() => cy.findByLabelText(label).select(value));
  },
);
