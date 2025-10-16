//

import { expect, test } from "bun:test";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { format } from "prettier";
import { Investigation } from "./Investigation";

test("render investigation section", async () => {
  const response = await new Hono()
    .get("/", jsxRenderer(), ({ render }) =>
      render(
        <Investigation
          organization={{
            cached_code_postal: "75015",
            siret: "12345678901234",
          }}
          banaticUrl="https://www.banatic.interieur.gouv.fr/intercommunalite/200099711"
        />,
      ),
    )
    .request("/");
  expect(response.status).toBe(200);
  expect(
    await format(await response.text(), { parser: "html" }),
  ).toMatchSnapshot();
});
