//

import { render_md } from "@~/app.ui/testing";
import { expect, test } from "bun:test";
import { context, type Values } from "../context";
import gendarmerie_agent from "./gendarmerie_agent";

//

test("returns error on 🦄 organization (gendarmerie) email", async () => {
  expect(
    await render_md(
      <context.Provider
        value={
          {
            moderation: {
              organization: {
                cached_libelle: "🦄",
                siret: "🌙✨",
                cached_libelle_categorie_juridique: "🐯",
              },
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
  return <>{gendarmerie_agent()}</>;
}
