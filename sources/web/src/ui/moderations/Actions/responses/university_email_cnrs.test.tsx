//

import { render_md } from "#src/ui/testing";
import { expect, test } from "bun:test";
import { context, type Values } from "../context";
import university_email_cnrs from "./university_email_cnrs";

//

test("returns university email agent - cnrs", async () => {
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
  return <>{university_email_cnrs()}</>;
}
