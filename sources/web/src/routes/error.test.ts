//

import { NotFoundError } from "#src/errors";
import { set_config } from "#src/middleware/config";
import { set_sentry } from "#src/middleware/sentry";
import { expect, test } from "bun:test";
import { Hono } from "hono";
import { error_handler } from "./error";

//

const app = new Hono()
  .use(set_config({}))
  .use(set_sentry())
  .get("/not_found", () => {
    throw new NotFoundError("L'utilisateur n'a pas de données FranceConnect.");
  })
  .get("/failure", () => {
    throw new Error("Crisp answered 400 - invalid_data");
  })
  .onError(error_handler);

test("htmx request gets the not found message as plain text", async () => {
  const response = await app.request("/not_found", {
    headers: { "HX-Request": "true" },
  });

  expect(response.status).toBe(404);
  expect(response.headers.get("content-type")).toStartWith("text/plain");
  expect(await response.text()).toBe(
    "L'utilisateur n'a pas de données FranceConnect.",
  );
});

test("htmx request gets the failure message as plain text", async () => {
  const response = await app.request("/failure", {
    headers: { "HX-Request": "true" },
  });

  expect(response.status).toBe(500);
  expect(response.headers.get("content-type")).toStartWith("text/plain");
  expect(await response.text()).toBe("Crisp answered 400 - invalid_data");
});
