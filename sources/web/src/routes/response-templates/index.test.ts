//

import { set_userinfo } from "#src/middleware/auth";
import { set_hyyyper_pg } from "#src/middleware/hyyyperbase";
import { set_nonce } from "#src/middleware/nonce";
import { empty_database, hyyyper_pglite } from "@~/hyyyperbase/testing";
import { insert_central_administration_response } from "@~/hyyyperbase/testing/response_templates";
import { insert_moderateur } from "@~/hyyyperbase/testing/users";
import { beforeEach, expect, test } from "bun:test";
import { Hono } from "hono";
import app from "./index";

//

beforeEach(empty_database);

async function make_app() {
  const moderator = await insert_moderateur(hyyyper_pglite);
  return new Hono()
    .use(set_nonce("nonce"))
    .use(set_hyyyper_pg(hyyyper_pglite))
    .use(set_userinfo({ email: moderator.email, sub: moderator.sub! }))
    .route("/", app);
}

//

test("GET /response-templates returns templates list page", async () => {
  const template = await insert_central_administration_response(hyyyper_pglite);

  const testing_app = await make_app();
  const response = await testing_app.request("/");

  expect(response.status).toBe(200);
  const html = await response.text();
  expect(html).toContain("Templates de réponse");
  expect(html).toContain(template.label);
});

test("GET /response-templates/:id returns 404 for unknown id", async () => {
  const testing_app = await make_app();
  const response = await testing_app.request("/9999");
  expect(response.status).toBe(404);
});

test("GET /response-templates/:id returns 404 for non-numeric id", async () => {
  const testing_app = await make_app();
  const response = await testing_app.request("/unknown-template-id");
  expect(response.status).toBe(404);
});

test("GET /response-templates/:id returns detail page", async () => {
  const template = await insert_central_administration_response(hyyyper_pglite);

  const testing_app = await make_app();
  const response = await testing_app.request(`/${template.id}`);

  expect(response.status).toBe(200);
  const html = await response.text();
  expect(html).toContain(template.label);
  expect(html).toContain("Retour à la liste");
});
