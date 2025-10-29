//

import { render_md } from "@~/app.ui/testing";
import { expect, test } from "bun:test";
import { context, type Values } from "../context";
import enseignement_agricole from "./enseignement_agricole";

//

test("returns domain @🦒 not valid", async () => {
  expect(
    await render_md(
      <context.Provider
        value={
          {
            domain: "🦒",
            moderation: {
              organization: { cached_libelle: "🦄" },
            },
          } as Values
        }
      >
        <Response />
      </context.Provider>,
    ),
  ).toMatchSnapshot();
});

function Response() {
  return <>{enseignement_agricole()}</>;
}
