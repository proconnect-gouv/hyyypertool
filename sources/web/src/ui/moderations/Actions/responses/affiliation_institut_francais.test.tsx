//

import { render_md } from "#src/ui/testing";
import { expect, test } from "bun:test";
import { context, type Values } from "../context";
import affiliation_institut_francais from "./affiliation_institut_francais";

//

test("Application for affiliation with the ‘Institut Français’ Foundation", async () => {
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
  return <>{affiliation_institut_francais()}</>;
}
