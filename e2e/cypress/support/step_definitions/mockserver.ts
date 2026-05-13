//

import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("un faux serveur {string}", function (server: string) {
  if (server === "api.crisp.chat") {
    cy.env(["API_CRISP_CHAT_URL", "CRISP_WEBSITE_ID"]).then(
      ({ API_CRISP_CHAT_URL, CRISP_WEBSITE_ID }) => {
        cy.request({
          method: "DELETE",
          url: `${API_CRISP_CHAT_URL}/v1/website/${CRISP_WEBSITE_ID}/conversations`,
        });
      },
    );
    return;
  }
  cy.exec(`docker compose restart ${server}`);
  cy.exec(`docker compose up --wait ${server}`);
});

Then("une notification mail est envoyée", function () {
  cy.env(["API_CRISP_CHAT_URL", "CRISP_WEBSITE_ID"]).then(
    ({ API_CRISP_CHAT_URL, CRISP_WEBSITE_ID }) => {
      // Retry because the notification is sent asynchronously
      cy.waitUntil(
        () =>
          cy
            .request({
              method: "GET",
              url: `${API_CRISP_CHAT_URL}/v1/website/${CRISP_WEBSITE_ID}/conversations`,
              failOnStatusCode: false,
            })
            .its("body.data")
            .then((data) => data.length > 0),
        { interval: 500, timeout: 5_000 },
      );
    },
  );
});

Then("une notification mail n'est pas envoyée", () => {
  cy.env(["API_CRISP_CHAT_URL", "CRISP_WEBSITE_ID"]).then(
    ({ API_CRISP_CHAT_URL, CRISP_WEBSITE_ID }) => {
      cy.request({
        method: "GET",
        url: `${API_CRISP_CHAT_URL}/v1/website/${CRISP_WEBSITE_ID}/conversations`,
      })
        .its("body.data")
        .should("have.length", 0);
    },
  );
});
