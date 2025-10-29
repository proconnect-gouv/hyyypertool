//

import { render_md } from "@~/app.ui/testing";
import { expect, test } from "bun:test";
import { context, type Values } from "../context";
import presta_email_admin_public from "./presta_email_admin_public";

//

test("returns presta e-mail Public administration - Employing organisation message", async () => {
  expect(
    await render_md(
      <context.Provider
        value={
          {
            domain: "🏩",
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
  return <>{presta_email_admin_public()}</>;
}
