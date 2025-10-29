//

import { expect, test } from "bun:test";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { format } from "prettier";
import { InactiveWarning } from "./InactiveWarning";

test("render inactive warning", async () => {
  const response = await new Hono()
    .get("/", jsxRenderer(), ({ render }) =>
      render(
        <InactiveWarning
          organization={{
            cached_est_active: true,
          }}
        />,
      ),
    )
    .request("/");
  expect(response.status).toBe(200);
  expect(
    await format(await response.text(), { parser: "html" }),
  ).toMatchSnapshot();
});

test("render nothing", async () => {
  const response = await new Hono()
    .get("/", jsxRenderer(), ({ render }) =>
      render(
        <InactiveWarning
          organization={{
            cached_est_active: false,
          }}
        />,
      ),
    )
    .request("/");
  expect(response.status).toBe(200);
  expect(
    await format(await response.text(), { parser: "html" }),
  ).toMatchSnapshot();
});
