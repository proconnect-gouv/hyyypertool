//

import { expect, test } from "bun:test";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { set_nonce } from "../nonce";
import { set_userinfo } from "./set_userinfo";
import { vip_list_guard } from "./vip_list.guard";

//

test("should let good captains pass", async () => {
  const app = new Hono().get(
    "/",
    set_nonce("nonce"),
    jsxRenderer(),
    set_userinfo({ email: "good@captain.yargs" }),
    vip_list_guard({ vip_list: ["good@captain.yargs"] }),
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
    set_nonce("nonce"),
    jsxRenderer(),
    vip_list_guard({ vip_list: [] }),
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
    set_nonce("nonce"),
    jsxRenderer(),
    vip_list_guard({ vip_list: [] }),
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
    set_nonce("nonce"),
    jsxRenderer(),
    set_userinfo({ email: "verybad@pirate.yargs" }),
    vip_list_guard({ vip_list: [] }),
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
