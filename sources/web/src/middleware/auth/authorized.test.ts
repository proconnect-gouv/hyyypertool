//

import { hyyyper_pglite, reset } from "@~/hyyyperbase/testing";
import {
  insert_admin,
  insert_disabled_user,
} from "@~/hyyyperbase/testing/users";
import { beforeEach, expect, test } from "bun:test";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { set_hyyyper_pg } from "../hyyyperbase";
import { set_nonce } from "../nonce";
import { authorized } from "./authorized";
import { set_userinfo } from "./set_userinfo";

//

beforeEach(reset);

test("should let good captains pass via ALLOWED_USERS", async () => {
  const app = new Hono().get(
    "/",
    jsxRenderer(),
    set_hyyyper_pg(hyyyper_pglite),
    set_nonce("nonce"),
    set_userinfo({ email: "good@captain.yargs" }),
    authorized(),
    async ({ text }) => text("✅"),
  );

  const res = await app.request("/", undefined, {
    ALLOWED_USERS: "good@captain.yargs",
  });

  expect(res.status).toBe(200);
  expect(await res.text()).toBe("✅");
});

test("should let active database users pass", async () => {
  const admin = await insert_admin(hyyyper_pglite);

  const app = new Hono().get(
    "/",
    jsxRenderer(),
    set_hyyyper_pg(hyyyper_pglite),
    set_nonce("nonce"),
    set_userinfo({ email: admin.email }),
    authorized(),
    async ({ text }) => text("✅"),
  );

  const res = await app.request("/", undefined, { ALLOWED_USERS: "" });

  expect(res.status).toBe(200);
  expect(await res.text()).toBe("✅");
});

test("should stop disabled database users", async () => {
  await insert_disabled_user(hyyyper_pglite);

  const app = new Hono().get(
    "/",
    jsxRenderer(),
    set_hyyyper_pg(hyyyper_pglite),
    set_nonce("nonce"),
    set_userinfo({ email: "disabled@yopmail.com" }),
    authorized(),
    async ({ text }) => text("✅"),
  );

  const res = await app.request("/", undefined, { ALLOWED_USERS: "" });

  expect(res.status).toBe(401);
  expect(await res.text()).toContain("Accès Non Autorisé");
});

test("should stop any anonymous user", async () => {
  const app = new Hono().get(
    "/",
    jsxRenderer(),
    set_nonce("nonce"),
    authorized(),
    async ({ text }) => text("✅"),
  );

  const res = await app.request("/", undefined, {
    ALLOWED_USERS: "good@captain.yargs",
  });

  expect(res.status).toBe(302);
  expect(await res.text()).toBe("");
});

test("should redirect hx-request", async () => {
  const app = new Hono().get(
    "/",
    jsxRenderer(),
    set_nonce("nonce"),
    authorized(),
    async ({ text }) => text("✅"),
  );

  const res = await app.request(
    "/",
    {
      headers: new Headers({ "hx-request": "true" }),
    },
    { ALLOWED_USERS: "good@captain.yargs" },
  );

  expect(res.status).toBe(401);
  expect(await res.text()).toBe("Unauthorized");
  expect(await res.headers.toJSON()).toEqual({
    "content-type": "text/plain; charset=UTF-8",
    "hx-location": "/",
  });
});

test("should stop pirates (not in ALLOWED_USERS, not in db)", async () => {
  const app = new Hono().get(
    "/",
    jsxRenderer(),
    set_hyyyper_pg(hyyyper_pglite),
    set_nonce("nonce"),
    set_userinfo({ email: "verybad@pirate.yargs" }),
    authorized(),
    async ({ text }) => text("✅"),
  );

  const res = await app.request("/", undefined, {
    ALLOWED_USERS: "good@captain.yargs",
  });

  expect(res.status).toBe(401);
  expect(await res.text()).toContain("Accès Non Autorisé");
});
