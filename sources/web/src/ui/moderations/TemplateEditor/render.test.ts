//

import { render } from "#src/lib/moderations";
import { expect, test } from "bun:test";
import { AVAILABLE_VARIABLES, SAMPLE_DATA } from "./render";

//

test("handles all available variables", () => {
  const template = AVAILABLE_VARIABLES.map(
    (v) => `${v.key}=\${ ${v.key} }`,
  ).join("\n");
  const result = render(template, SAMPLE_DATA);

  expect(result.ok).toBe(true);
  expect(result.result).toMatchInlineSnapshot(`
      "categorie_juridique=Commune
      domain=paris.fr
      email=jean.dupont@paris.fr
      family_name=Dupont
      given_name=Jean
      organization_name=Mairie de Paris
      siret=21750001600019
      suggest_emails_associated_to_user=jean.dupont@mairie.paris.fr
      suggest_organization_domains=paris.fr"
    `);
});
