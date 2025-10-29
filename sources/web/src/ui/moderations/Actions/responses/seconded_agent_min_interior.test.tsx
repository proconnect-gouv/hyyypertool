//

import { render_md } from "#src/ui/testing";
import { expect, test } from "bun:test";
import { context, type Values } from "../context";
import seconded_agent_min_interior from "./seconded_agent_min_interior";

//

test("returns seconded agent diplomatie.gouv - Ministry of the Interior", async () => {
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
  return <>{seconded_agent_min_interior()}</>;
}
