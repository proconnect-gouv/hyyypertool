import { expect, test } from "bun:test";
import { Hono } from "hono";
import { validator } from "hono/validator";
import { create_urls } from "./urls";

test("index.$hx_get() returns a hx-get attribute", () => {
  const app = new Hono().get("/", ({ text }) => text("OK"));
  const attribute = create_urls<typeof app>().index.$hx_get();
  expect(attribute).toEqual({
    "hx-get": "/",
  });
});

test(":slug.$hx_get() returns a hx-get attribute", () => {
  const app = new Hono().get("/:slug", ({ text }) => text("OK"));
  const attribute = create_urls<typeof app>()[":slug"].$hx_get({
    param: { slug: "foo" },
  });
  expect(attribute).toEqual({
    "hx-get": "/foo",
  });
});

test("index.$hx_post() returns a hx-post attribute", () => {
  const app = new Hono().post("/", ({ text }) => text("OK"));
  const attribute = create_urls<typeof app>().index.$hx_post();
  expect(attribute).toEqual({
    "hx-post": "/",
  });
});

test(":slug.$hx_post() returns a hx-post attribute", () => {
  const app = new Hono().post("/:slug", ({ text }) => text("OK"));
  const attribute = create_urls<typeof app>()[":slug"].$hx_post({
    param: { slug: "foo" },
  });
  expect(attribute).toEqual({
    "hx-post": "/foo",
  });
});

test("index.$hx_put() returns a hx-put attribute", () => {
  const app = new Hono().put("/", ({ text }) => text("OK"));
  const attribute = create_urls<typeof app>().index.$hx_put();
  expect(attribute).toEqual({
    "hx-put": "/",
  });
});

test(":slug.$hx_put() returns a hx-put attribute", () => {
  const app = new Hono().put("/:slug", ({ text }) => text("OK"));
  const attribute = create_urls<typeof app>()[":slug"].$hx_put({
    param: { slug: "foo" },
  });
  expect(attribute).toEqual({
    "hx-put": "/foo",
  });
});

test("index.$hx_delete() returns a hx-delete attribute", () => {
  const app = new Hono().delete("/", ({ text }) => text("OK"));
  const attribute = create_urls<typeof app>().index.$hx_delete();
  expect(attribute).toEqual({
    "hx-delete": "/",
  });
});

test(":slug.$hx_delete() returns a hx-delete attribute", () => {
  const app = new Hono().delete("/:slug", ({ text }) => text("OK"));
  const attribute = create_urls<typeof app>()[":slug"].$hx_delete({
    param: { slug: "foo" },
  });
  expect(attribute).toEqual({
    "hx-delete": "/foo",
  });
});

test("index.$hx_patch() returns a hx-patch attribute", () => {
  const app = new Hono().patch("/", ({ text }) => text("OK"));
  const attribute = create_urls<typeof app>().index.$hx_patch();
  expect(attribute).toEqual({
    "hx-patch": "/",
  });
});

test(":slug.$hx_patch() returns a hx-patch attribute", () => {
  const app = new Hono().patch("/:slug", ({ text }) => text("OK"));
  const attribute = create_urls<typeof app>()[":slug"].$hx_patch({
    param: { slug: "foo" },
  });
  expect(attribute).toEqual({
    "hx-patch": "/foo",
  });
});

test("index.$hx_options() returns a hx-options attribute", () => {
  const app = new Hono().options("/", ({ text }) => text("OK"));
  const attribute = create_urls<typeof app>().index.$hx_options();
  expect(attribute).toEqual({
    "hx-options": "/",
  });
});

test(":slug.$hx_options() returns a hx-options attribute", () => {
  const app = new Hono().options("/:slug", ({ text }) => text("OK"));
  const attribute = create_urls<typeof app>()[":slug"].$hx_options({
    param: { slug: "foo" },
  });
  expect(attribute).toEqual({
    "hx-options": "/foo",
  });
});

test("index.$hx_get() with query returns a hx-get attribute with query", () => {
  const app = new Hono().get(
    "/",
    validator("query", (value) => ({
      weapon: Array.isArray(value["weapon"])
        ? value["weapon"].join(",")
        : value["weapon"],
    })),
    ({ text }) => text("OK"),
  );

  const attribute = create_urls<typeof app>().index.$hx_get({
    query: { weapon: "axe" },
  });

  expect(attribute).toEqual({
    "hx-get": "/?weapon=axe",
  });
});

test("with form data returns a hx-vals attribute", () => {
  const app = new Hono().post(
    "/",
    validator("form", (value) => ({
      weapon: Array.isArray(value["weapon"])
        ? value["weapon"].join(",")
        : value["weapon"],
    })),
    ({ text }) => text("OK"),
  );

  const attribute = create_urls<typeof app>().index.$hx_post({
    form: { weapon: "axe" },
  });

  expect(attribute).toEqual({
    "hx-post": "/",
    "hx-vals": JSON.stringify({ weapon: "axe" }),
  });
});

test("hx-vals attribute is optional", () => {
  const app = new Hono().post(
    "/",
    validator("form", (value) => ({
      weapon: Array.isArray(value["weapon"])
        ? value["weapon"].join(",")
        : value["weapon"],
    })),
    ({ text }) => text("OK"),
  );

  const attribute = create_urls<typeof app>().index.$hx_post();

  expect(attribute).toEqual({
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

  const attribute = create_urls<typeof app>().foo[":slug"].quz.$hx_post({
    param: { slug: "bar" },
  });

  expect(attribute).toEqual({
    "hx-post": "/foo/bar/quz",
  });
});

test("params accept numbers and convert them to strings", () => {
  const app = new Hono().get("/:id", ({ text }) => text("OK"));
  const attribute = create_urls<typeof app>()[":id"].$hx_get({
    param: { id: 42 },
  });
  expect(attribute).toEqual({
    "hx-get": "/42",
  });
});
