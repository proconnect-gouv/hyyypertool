//

import { render_md } from "#src/ui/testing";
import { expect, test } from "bun:test";
import { context, type Values } from "../context";
import agent_outside_min_finance_chorus_pro from "./agent_outside_min_finance_chorus_pro";

//

test("returns Agent outside Min Finances -> Chorus Pro response", async () => {
  expect(
    await render_md(
      <context.Provider
        value={
          {
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
  return <>{agent_outside_min_finance_chorus_pro()}</>;
}
