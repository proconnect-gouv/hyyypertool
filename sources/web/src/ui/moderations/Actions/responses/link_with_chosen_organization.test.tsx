//

import { render_md } from "#src/ui/testing";
import { expect, test } from "bun:test";
import { context, type Values } from "../context";
import link_with_chosen_organization from "./link_with_chosen_organization";

//

test("returns link with organization email", async () => {
  expect(
    await render_md(
      <context.Provider
        value={
          {
            moderation: {
              organization: { cached_libelle: "🦄" },
              user: { email: "💌" },
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
  return <>{link_with_chosen_organization()}</>;
}
