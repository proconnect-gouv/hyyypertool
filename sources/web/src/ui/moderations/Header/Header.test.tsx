//

import { render_html } from "#src/ui/testing";
import { expect, test } from "bun:test";
import { Header } from "./Header";

test("render header section", async () => {
  expect(
    await render_html(
      <Header.Provier
        value={{
          moderation: {
            comment: null,
            created_at: "2023-01-01T00:00:00.000Z",
            moderated_at: null,
            moderated_by: null,
            id: 42,
            organization: { cached_libelle: "🦄 libelle", id: 43 },
            type: "organization_join_block",
            user: {
              email: "adora.pony@unicorn.xyz",
              family_name: "Pony",
              given_name: "Adora",
              id: 44,
            },
          },
        }}
      >
        <Header />
      </Header.Provier>,
    ),
  ).toMatchSnapshot();
});
