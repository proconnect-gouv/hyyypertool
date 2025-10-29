//

import { render_md } from "#src/ui/testing";
import { expect, test } from "bun:test";
import { context, type Values } from "../context";
import agent_comcom_to_commune from "./agent_comcom_to_commune";

//

test("returns agent “ComCom, ComAgglo, Métropole” —> Communes response", async () => {
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
  return <>{agent_comcom_to_commune()}</>;
}
