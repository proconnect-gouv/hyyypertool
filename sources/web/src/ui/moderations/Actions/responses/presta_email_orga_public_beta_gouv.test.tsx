//

import { render_md } from "@~/app.ui/testing";
import { expect, test } from "bun:test";
import { context, type Values } from "../context";
import presta_email_orga_public_beta_gouv from "./presta_email_orga_public_beta_gouv";

//

test("returns presta E-mail Employing organisation or beta.gouv - Public administration response", async () => {
  expect(
    await render_md(
      <context.Provider
        value={
          {
            domain: "🍄",
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
  return <>{presta_email_orga_public_beta_gouv()}</>;
}
