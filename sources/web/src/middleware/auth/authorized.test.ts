//

import { schema } from "@~/hyyyperbase";
import { hyyyper_pglite, reset } from "@~/hyyyperbase/testing";
import {
  insert_admin,
  insert_disabled_user,
} from "@~/hyyyperbase/testing/users";
import { beforeEach, expect, test } from "bun:test";
import { eq } from "drizzle-orm";
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

//
// sub-based lookup tests
//

test("should find user by sub", async () => {
  const admin = await insert_admin(hyyyper_pglite);

  const app = new Hono().get(
    "/",
    jsxRenderer(),
    set_hyyyper_pg(hyyyper_pglite),
    set_nonce("nonce"),
    set_userinfo({ sub: "oidc-sub-admin", email: admin.email }),
    authorized(),
    async ({ text }) => text("✅"),
  );

  const res = await app.request("/", undefined, { ALLOWED_USERS: "" });

  expect(res.status).toBe(200);
  expect(await res.text()).toBe("✅");
});

test("should backfill sub when user found by email", async () => {
  const admin = await insert_admin(hyyyper_pglite);
  // Clear seeded sub to simulate a legacy user without sub
  await hyyyper_pglite
    .update(schema.users)
    .set({ sub: null })
    .where(eq(schema.users.id, admin.id));

  const app = new Hono().get(
    "/",
    jsxRenderer(),
    set_hyyyper_pg(hyyyper_pglite),
    set_nonce("nonce"),
    set_userinfo({ sub: "new-oidc-sub", email: admin.email }),
    authorized(),
    async ({ text }) => text("✅"),
  );

  const res = await app.request("/", undefined, { ALLOWED_USERS: "" });

  expect(res.status).toBe(200);

  const updated = await hyyyper_pglite.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, admin.id),
    columns: { sub: true },
  });
  expect(updated!.sub).toBe("new-oidc-sub");
});

test("should sync email when user found by sub with different email", async () => {
  const admin = await insert_admin(hyyyper_pglite);

  const app = new Hono().get(
    "/",
    jsxRenderer(),
    set_hyyyper_pg(hyyyper_pglite),
    set_nonce("nonce"),
    set_userinfo({ sub: "oidc-sub-admin", email: "new-email@omega.gouv.fr" }),
    authorized(),
    async ({ text }) => text("✅"),
  );

  const res = await app.request("/", undefined, { ALLOWED_USERS: "" });

  expect(res.status).toBe(200);

  const updated = await hyyyper_pglite.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, admin.id),
    columns: { email: true },
  });
  expect(updated!.email).toBe("new-email@omega.gouv.fr");
});

test("should not backfill sub if already set", async () => {
  const admin = await insert_admin(hyyyper_pglite);

  const app = new Hono().get(
    "/",
    jsxRenderer(),
    set_hyyyper_pg(hyyyper_pglite),
    set_nonce("nonce"),
    set_userinfo({ sub: "oidc-sub-admin", email: admin.email }),
    authorized(),
    async ({ text }) => text("✅"),
  );

  const res = await app.request("/", undefined, { ALLOWED_USERS: "" });

  expect(res.status).toBe(200);

  const updated = await hyyyper_pglite.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, admin.id),
    columns: { sub: true },
  });
  expect(updated!.sub).toBe("oidc-sub-admin");
});
