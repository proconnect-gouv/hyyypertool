//

import { render_md } from "#src/ui/testing";
import { expect, test } from "bun:test";
import { context, type Values } from "../context";
import evidence_between_chosen_org_and_domain_email_org from "./evidence_between_chosen_org_and_domain_email_org";

//

test("Request for evidence of the link between the chosen organisation and the organisation associated with the email domain", async () => {
  expect(
    await render_md(
      <context.Provider
        value={
          {
            domain: "🦒",
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
  return <>{evidence_between_chosen_org_and_domain_email_org()}</>;
}
