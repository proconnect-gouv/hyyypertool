//

import type { get_zammad_attachment } from "@~/zammad.lib/get_zammad_attachment";
import { expect, mock, test } from "bun:test";

//

test("GET /attachment/123/456/789 : 🪴", async () => {
  mock.module("@~/zammad.lib/get_zammad_attachment", () => {
    return {
      get_zammad_attachment: mock<typeof get_zammad_attachment>(() =>
        Promise.resolve(new Response("🪴")),
      ),
    };
  });

  const { default: app } = await import("./index");

  const res = await app.request("/attachment/123/456/789");

  expect(res.status).toBe(200);
  expect(await res.text()).toEqual("🪴");
});

test("❎ fails with 404 on TypeError", async () => {
  mock.module("@~/zammad.lib/get_zammad_attachment", () => {
    return {
      get_zammad_attachment: mock<typeof get_zammad_attachment>(() =>
        Promise.reject(new TypeError("🧟")),
      ),
    };
  });

  const { default: app } = await import("./index");

  const res = await app.request("/attachment/123/456/789");

  expect(res.status).toBe(404);
  expect(await res.text()).toEqual("404 Not Found");
});

test("❎ fails with 404 on SyntaxError", async () => {
  mock.module("@~/zammad.lib/get_zammad_attachment", () => {
    return {
      get_zammad_attachment: mock<typeof get_zammad_attachment>(() =>
        Promise.reject(new SyntaxError("🧟")),
      ),
    };
  });

  const { default: app } = await import("./index");

  const res = await app.request("/attachment/123/456/789");

  expect(res.status).toBe(404);
  expect(await res.text()).toEqual("404 Not Found");
});

test("❌ bubble other errors", async () => {
  mock.module("@~/zammad.lib/get_zammad_attachment", () => {
    return {
      get_zammad_attachment: mock<typeof get_zammad_attachment>(() =>
        Promise.reject(new Error("🦭")),
      ),
    };
  });

  const { default: app } = await import("./index");

  expect(async () => {
    await app.request("/attachment/123/456/789");
  }).toThrow("🦭");
});
