//

import { set_userinfo } from "#src/middleware/auth";
import { set_config } from "#src/middleware/config";
import { set_hyyyper_pg } from "#src/middleware/hyyyperbase";
import { set_nonce } from "#src/middleware/nonce";
import { schema } from "@~/hyyyperbase";
import { hyyyper_pglite, reset } from "@~/hyyyperbase/testing";
import { insert_moderateur } from "@~/hyyyperbase/testing/users";
import { beforeEach, expect, test } from "bun:test";
import { Hono } from "hono";
import app from "./index";

//

beforeEach(reset);

async function make_app() {
  const moderator = await insert_moderateur(hyyyper_pglite);
  return new Hono()
    .use(set_config({ ALLOWED_USERS: moderator.email }))
    .use(set_nonce("nonce"))
    .use(set_hyyyper_pg(hyyyper_pglite))
    .use(set_userinfo({ email: moderator.email, sub: moderator.sub! }))
    .route("/", app);
}

//

test("GET /response-templates returns templates list page", async () => {
  await hyyyper_pglite.insert(schema.response_templates).values({
    label: "Mon template",
    content: "Bonjour ${ given_name },",
  });

  const testing_app = await make_app();
  const response = await testing_app.request("/");

  expect(response.status).toBe(200);
  const html = await response.text();
  expect(html).toContain("Templates de réponse");
  expect(html).toContain("Mon template");
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
  const [inserted] = await hyyyper_pglite
    .insert(schema.response_templates)
    .values({ label: "Mon template", content: "Bonjour ${ given_name }," })
    .returning({ id: schema.response_templates.id });

  const testing_app = await make_app();
  const response = await testing_app.request(`/${inserted!.id}`);

  expect(response.status).toBe(200);
  const html = await response.text();
  expect(html).toContain("Mon template");
  expect(html).toContain("Retour à la liste");
});
