//

import { render_md } from "#src/ui/testing";
import { expect, test } from "bun:test";
import { context, type Values } from "../context";
import more_precise_existing_establishement_cnrs from "./more_precise_existing_establishement_cnrs";

//

test("returns more precise existing establishement - cnrs message", async () => {
  expect(
    await render_md(
      <context.Provider
        value={
          {
            domain: "🧿",
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
  return <>{more_precise_existing_establishement_cnrs()}</>;
}
