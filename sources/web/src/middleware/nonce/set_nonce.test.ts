//

import { expect, test } from "bun:test";
import { Hono } from "hono";
import { set_nonce } from "./set_nonce";

//

test("should set nonce variable", async () => {
  const app = new Hono().get(
    "/",
    set_nonce(),
    async ({ text, var: { nonce } }) => {
      return text(nonce);
    },
  );

  const res = await app.request("/");

  expect(res.status).toBe(200);
  const nonce = await res.text();
  expect(typeof nonce).toBe("string");
  expect(nonce.length).toBeGreaterThan(11);
});
