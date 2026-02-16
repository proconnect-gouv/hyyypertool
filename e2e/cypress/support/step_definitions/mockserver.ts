//

import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";

// from https://app.swaggerhub.com/apis/jamesdbloom/mock-server-openapi/5.15.x#/Verification
type MockServerRequestVerificationBody = {
  httpRequest: {
    path: string;
  };
  times?: {
    atLeast?: number;
    atMost?: number;
  };
};

Given("un faux serveur {string}", function (server: string) {
  cy.exec(`docker compose restart ${server}`);
  cy.exec(`docker compose up --wait ${server}`);
});

Then("une notification mail est envoyée", function () {
  cy.env(["APP_MONCOMPTEPRO_URL"]).then(({ APP_MONCOMPTEPRO_URL }) => {
    const url = new URL("/mockserver/verify", APP_MONCOMPTEPRO_URL).href;
    const body = {
      httpRequest: { path: "/api/admin/send-moderation-processed-email" },
      times: { atLeast: 1 },
    } satisfies MockServerRequestVerificationBody;

    // Retry because the notification is sent asynchronously
    cy.waitUntil(
      () =>
        cy
          .request({ method: "PUT", url, body, failOnStatusCode: false })
          .its("status")
          .then((status) => status === 202),
      { interval: 500, timeout: 10_000 },
    );
  });
});

Then("une notification mail n'est pas envoyée", () => {
  cy.env(["APP_MONCOMPTEPRO_URL"]).then(({ APP_MONCOMPTEPRO_URL }) => {
    cy.request({
      body: {
        httpRequest: { path: "/api/admin/send-moderation-processed-email" },
        times: { atMost: 0 },
      } satisfies MockServerRequestVerificationBody,
      method: "PUT",
      url: new URL("/mockserver/verify", APP_MONCOMPTEPRO_URL).href,
    })
      .its("status")
      .should("equal", 202);
  });
});
