//

import { set_config } from "#src/middleware/config";
import { expect, test } from "bun:test";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { set_nonce } from "../nonce";
import { authorized } from "./authorized";
import { set_userinfo } from "./set_userinfo";

//

test("should let good captains pass", async () => {
  const app = new Hono().get(
    "/",
    jsxRenderer(),
    set_config({ ALLOWED_USERS: "good@captain.yargs" }),
    set_nonce("nonce"),
    set_userinfo({ email: "good@captain.yargs" }),
    authorized(),
    async ({ text }) => {
      return text("✅");
    },
  );

  const res = await app.request("/");

  expect(res.status).toBe(200);
  const body = await res.text();
  expect(body).toBe("✅");
});

test("should stop any anonymous user", async () => {
  const app = new Hono().get(
    "/",
    jsxRenderer(),
    set_config({ ALLOWED_USERS: "good@captain.yargs" }),
    set_nonce("nonce"),
    authorized(),
    async ({ text }) => {
      return text("✅");
    },
  );

  const res = await app.request("/");

  expect(res.status).toBe(302);
  expect(await res.text()).toBe("");
});

test("should redirect hx-request", async () => {
  const app = new Hono().get(
    "/",
    jsxRenderer(),
    set_config({ ALLOWED_USERS: "good@captain.yargs" }),
    set_nonce("nonce"),
    authorized(),
    async ({ text }) => {
      return text("✅");
    },
  );

  const res = await app.request("/", {
    headers: new Headers({ "hx-request": "true" }),
  });

  expect(res.status).toBe(401);
  expect(await res.text()).toBe("Unauthorized");
});

test("should stop pirates", async () => {
  const app = new Hono().get(
    "/",
    jsxRenderer(),
    set_config({ ALLOWED_USERS: "good@captain.yargs" }),
    set_nonce("nonce"),
    set_userinfo({ email: "verybad@pirate.yargs" }),
    authorized(),
    async ({ text }) => {
      return text("✅");
    },
  );

  const res = await app.request("/");

  expect(res.status).toBe(200);
  const body = await res.text();
  expect(body).toContain("<!DOCTYPE html>");
  expect(body).toContain("Accès Non Autorisé");
});
