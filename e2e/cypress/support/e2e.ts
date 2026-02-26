import "cypress-wait-until";

Cypress.on("uncaught:exception", (err) => {
  if (err.message.includes("htmx is not defined")) return false;
  return true;
});
