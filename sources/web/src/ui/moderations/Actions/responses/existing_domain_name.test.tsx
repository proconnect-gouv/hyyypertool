//

import { render_md } from "#src/ui/testing";
import { expect, test } from "bun:test";
import { context, type Values } from "../context";
import existing_domain_name, { label } from "./existing_domain_name";

//

test(label, async () => {
  const query_suggest_organization_domains = async (
    _organization_id: number,
  ) => ["yahoo.fr", "test.koukou"];
  expect(
    await render_md(
      <context.Provider
        value={
          {
            moderation: {
              organization: { cached_libelle: "🦄" },
            },
            query_suggest_organization_domains,
          } as Values
        }
      >
        <Response />
      </context.Provider>,
    ),
  ).toMatchInlineSnapshot(`
    "Bonjour,

    Nous avons bien reçu votre demande de rattachement à l&#39;organisation « 🦄 » sur ProConnect (anciennement : AgentConnect, MonComptePro).

    D’après nos recherches, l’organisation « 🦄 » dispose d’un nom de domaine officiel.
    Conformément à nos règles, nous ne pouvons pas accepter votre demande de rattachement avec votre adresse e-mail personnelle ou associée à un domaine grand public (gmail, orange, wanadoo, yahoo…).
    Veuillez créer à nouveau votre compte utilisateur avec votre adresse e-mail professionnelle, associée au nom de domaine : « yahoo.fr », « test.koukou ».

    Bien cordialement,
    L’équipe ProConnect.
    "
  `);
});

function Response() {
  return <>{existing_domain_name()}</>;
}
