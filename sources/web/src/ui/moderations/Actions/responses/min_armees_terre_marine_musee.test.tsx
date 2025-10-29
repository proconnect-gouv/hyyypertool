//

import { render_md } from "@~/app.ui/testing";
import { expect, test } from "bun:test";
import { context, type Values } from "../context";
import min_armees_terre_marine_musee from "./min_armees_terre_marine_musee";

//

test("returns error on 🦄 organization (min armée) email", async () => {
  expect(
    await render_md(
      <context.Provider
        value={
          {
            moderation: {
              organization: {
                cached_libelle: "🦄",
                cached_libelle_categorie_juridique: "👾",
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
  return <>{min_armees_terre_marine_musee()}</>;
}
