//

import { expect, test } from "bun:test";
import { Hono } from "hono";
import { set_variables } from "./set_variables";

//

test("set_variables calls set function for each key-value pair", () => {
  const mockSet = new Map();
  const setFn = mockSet.set.bind(mockSet);

  set_variables(setFn, {
    user: { id: 1, name: "Test User" },
    organization: { id: 2, title: "Test Org" },
  });

  expect(mockSet).toMatchInlineSnapshot(`
    Map {
      "user" => {
        "id": 1,
        "name": "Test User",
      },
      "organization" => {
        "id": 2,
        "title": "Test Org",
      },
    }
  `);
});

test("should be compatible the Hono Context#set function", async () => {
  const app = new Hono<{}>().get(
    "/",
    function set_variables_middleware({ set }, next) {
      set_variables(set, { foo: "bar" });

      return next();
    },
    function GET({ json, var: variables }) {
      return json({ variables });
    },
  );

  const res = await app.request("/");

  expect(res.status).toBe(200);
  await expect(res.json()).resolves.toMatchInlineSnapshot(`
    {
      "variables": {
        "foo": "bar",
      },
    }
  `);
});
