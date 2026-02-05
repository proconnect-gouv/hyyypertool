//

import { set_userinfo } from "#src/middleware/auth";
import { set_config } from "#src/middleware/config";
import { set_nonce } from "#src/middleware/nonce";
import { expect, test } from "bun:test";
import { Hono } from "hono";
import app from "./index";

//

test("GET /response-templates returns templates list page", async () => {
  const response = await new Hono()
    .use(set_config({ ALLOWED_USERS: "test@example.com" }))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: "test@example.com" }))
    .route("/", app)
    .request("/");

  expect(response.status).toBe(200);
  const html = await response.text();
  expect(html).toContain("Templates de réponse");
  expect(html).toContain("Nom et/ou Prénom manquants");
});

test("GET /response-templates/:id returns 404 for unknown template", async () => {
  const response = await new Hono()
    .use(set_config({ ALLOWED_USERS: "test@example.com" }))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: "test@example.com" }))
    .route("/", app)
    .request("/unknown-template-id");

  expect(response.status).toBe(404);
});

test("GET /response-templates/missing_name returns detail page", async () => {
  const response = await new Hono()
    .use(set_config({ ALLOWED_USERS: "test@example.com" }))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: "test@example.com" }))
    .route("/", app)
    .request("/missing_name");

  expect(response.status).toBe(200);
  const html = await response.text();
  expect(html).toContain(
    "Les comptes utilisateurs ProConnect doivent être associés à une personne physique.",
  );
  expect(html).toContain("Retour à la liste");
});
