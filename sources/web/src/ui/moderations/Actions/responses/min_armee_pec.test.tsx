//

import { render_md } from "#src/ui/testing";
import { expect, test } from "bun:test";
import { context, type Values } from "../context";
import min_armees_pec from "./min_armees_pec";

//

test("returns error on 🦄 organization (min armée pec) email", async () => {
  expect(
    await render_md(
      <context.Provider
        value={
          {
            moderation: {
              organization: { cached_libelle: "🦄", siret: "🌸" },
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
  return <>{min_armees_pec()}</>;
}
