//

import { expect, test } from "bun:test";
import { Hono } from "hono";
import { validator } from "hono/validator";
import { hono_hx_attibute } from "./hx_urls";

//

test("index.$get() returns a hx-get attibute", () => {
  const app = new Hono().get("/", ({ text }) => text("OK"));
  const attibute = hono_hx_attibute<typeof app>().index.$get();
  expect(attibute).toEqual({
    "hx-get": "/",
  });
});

test(":slug.$get() returns a hx-get attibute", () => {
  const app = new Hono().get("/:slug", ({ text }) => text("OK"));
  const attibute = hono_hx_attibute<typeof app>()[":slug"].$get({
    param: { slug: "foo" },
  });
  expect(attibute).toEqual({
    "hx-get": "/foo",
  });
});

test("index.$post() returns a hx-post attibute", () => {
  const app = new Hono().post("/", ({ text }) => text("OK"));
  const attibute = hono_hx_attibute<typeof app>().index.$post();
  expect(attibute).toEqual({
    "hx-post": "/",
  });
});

test(":slug.$post() returns a hx-post attibute", () => {
  const app = new Hono().post("/:slug", ({ text }) => text("OK"));
  const attibute = hono_hx_attibute<typeof app>()[":slug"].$post({
    param: { slug: "foo" },
  });
  expect(attibute).toEqual({
    "hx-post": "/foo",
  });
});

test("index.$put() returns a hx-put attibute", () => {
  const app = new Hono().put("/", ({ text }) => text("OK"));
  const attibute = hono_hx_attibute<typeof app>().index.$put();
  expect(attibute).toEqual({
    "hx-put": "/",
  });
});

test(":slug.$put() returns a hx-put attibute", () => {
  const app = new Hono().put("/:slug", ({ text }) => text("OK"));
  const attibute = hono_hx_attibute<typeof app>()[":slug"].$put({
    param: { slug: "foo" },
  });
  expect(attibute).toEqual({
    "hx-put": "/foo",
  });
});

test("index.$delete() returns a hx-delete attibute", () => {
  const app = new Hono().delete("/", ({ text }) => text("OK"));
  const attibute = hono_hx_attibute<typeof app>().index.$delete();
  expect(attibute).toEqual({
    "hx-delete": "/",
  });
});

test(":slug.$delete() returns a hx-delete attibute", () => {
  const app = new Hono().delete("/:slug", ({ text }) => text("OK"));
  const attibute = hono_hx_attibute<typeof app>()[":slug"].$delete({
    param: { slug: "foo" },
  });
  expect(attibute).toEqual({
    "hx-delete": "/foo",
  });
});

test("index.$patch() returns a hx-patch attibute", () => {
  const app = new Hono().patch("/", ({ text }) => text("OK"));
  const attibute = hono_hx_attibute<typeof app>().index.$patch();
  expect(attibute).toEqual({
    "hx-patch": "/",
  });
});

test(":slug.$patch() returns a hx-patch attibute", () => {
  const app = new Hono().patch("/:slug", ({ text }) => text("OK"));
  const attibute = hono_hx_attibute<typeof app>()[":slug"].$patch({
    param: { slug: "foo" },
  });
  expect(attibute).toEqual({
    "hx-patch": "/foo",
  });
});

test("index.$options() returns a hx-options attibute", () => {
  const app = new Hono().options("/", ({ text }) => text("OK"));
  const attibute = hono_hx_attibute<typeof app>().index.$options();
  expect(attibute).toEqual({
    "hx-options": "/",
  });
});

test(":slug.$options() returns a hx-options attibute", () => {
  const app = new Hono().options("/:slug", ({ text }) => text("OK"));
  const attibute = hono_hx_attibute<typeof app>()[":slug"].$options({
    param: { slug: "foo" },
  });
  expect(attibute).toEqual({
    "hx-options": "/foo",
  });
});

//

test("index.$get() with query returns a hx-get attibute with query", () => {
  const app = new Hono().get(
    "/",
    validator("query", (value) => ({
      weapon: Array.isArray(value["weapon"])
        ? value["weapon"].join(",")
        : value["weapon"],
    })),
    ({ text }) => text("OK"),
  );

  const attibute = hono_hx_attibute<typeof app>().index.$get({
    query: { weapon: "axe" },
  });

  expect(attibute).toEqual({
    "hx-get": "/?weapon=axe",
  });
});

//

test("with form data returns a hx-val attibute", () => {
  const app = new Hono().post(
    "/",
    validator("form", (value) => ({
      weapon: Array.isArray(value["weapon"])
        ? value["weapon"].join(",")
        : value["weapon"],
    })),
    ({ text }) => text("OK"),
  );

  const attibute = hono_hx_attibute<typeof app>().index.$post({
    form: { weapon: "axe" },
  });

  expect(attibute).toEqual({
    "hx-post": "/",
    "hx-vals": JSON.stringify({ weapon: "axe" }),
  });
});

test("hx-val attibute is optional", () => {
  const app = new Hono().post(
    "/",
    validator("form", (value) => ({
      weapon: Array.isArray(value["weapon"])
        ? value["weapon"].join(",")
        : value["weapon"],
    })),
    ({ text }) => text("OK"),
  );

  const attibute = hono_hx_attibute<typeof app>().index.$post();

  expect(attibute).toEqual({
    "hx-post": "/",
  });
});

test("should keep mandatory href params", () => {
  const app = new Hono().post(
    "/foo/:slug/quz",
    validator("form", (value) => ({
      weapon: Array.isArray(value["weapon"])
        ? value["weapon"].join(",")
        : value["weapon"],
    })),
    ({ text }) => text("OK"),
  );

  const attibute = hono_hx_attibute<typeof app>().foo[":slug"].quz.$post({
    param: { slug: "bar" },
  });

  expect(attibute).toEqual({
    "hx-post": "/foo/bar/quz",
  });
});

//

test("params accept numbers and convert them to strings", () => {
  const app = new Hono().get("/:id", ({ text }) => text("OK"));
  const attibute = hono_hx_attibute<typeof app>()[":id"].$get({
    param: { id: 42 },
  });
  expect(attibute).toEqual({
    "hx-get": "/42",
  });
});

//

// NOTE: form fields are intentionally not type-checked because in HTMX
// form data can come from the HTML <form> element, not just hx-vals
