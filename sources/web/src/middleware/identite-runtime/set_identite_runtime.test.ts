//

import { pg } from "@~/identite-proconnect/database/testing";
import { expect, mock, test } from "bun:test";
import { Hono } from "hono";
import { set_identite_pg } from "../identite-pg";
import { set_identite_runtime } from "./set_identite_runtime";

//

async function request_without_moderator(headers?: Record<string, string>) {
  const session = { deleteSession: mock() };
  const handler = mock(() => new Response("🔓"));
  const response = await new Hono()
    .use(set_identite_pg(pg))
    .use(async ({ set }, next) => {
      set("session" as never, session as never);
      await next();
    })
    .get("/", set_identite_runtime(), handler)
    .request("/", { headers });

  return { handler, response, session };
}

//

test("logs out and redirects home without a moderator", async () => {
  const { handler, response, session } = await request_without_moderator();

  expect(response.status).toBe(302);
  expect(response.headers.get("Location")).toBe("/");
  expect(session.deleteSession).toHaveBeenCalled();
  expect(handler).not.toHaveBeenCalled();
});

test("logs out and sends htmx home without a moderator", async () => {
  const { handler, response, session } = await request_without_moderator({
    "HX-Request": "true",
  });

  expect(response.status).toBe(401);
  expect(response.headers.get("HX-Location")).toBe("/");
  expect(session.deleteSession).toHaveBeenCalled();
  expect(handler).not.toHaveBeenCalled();
});
