import { set_crisp_client } from "#src/middleware/crisp";
import {
  hyyyper_pglite,
  empty_database as hyyyperbase_empty_database,
} from "@~/hyyyperbase/testing";
import { insert_moderateur } from "@~/hyyyperbase/testing/users";
import { insert_database } from "@~/identite-proconnect/database/seed/insert";
import {
  empty_database as identite_empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/database/testing";
import { create_testing_router } from "#src/testing";
import { Scenario } from "bun-webview-dsl";
import { afterAll, beforeAll, describe, mock } from "bun:test";

//

const mock_crisp = {
  create_conversation: mock().mockResolvedValue({ session_id: "test-session" }),
  get_user: mock().mockResolvedValue(null),
  send_message: mock().mockResolvedValue(undefined),
  mark_conversation_as_resolved: mock().mockResolvedValue(undefined),
};

let server: ReturnType<typeof Bun.serve>;
beforeAll(migrate);
beforeAll(() => {
  const router = create_testing_router();
  router.use(set_crisp_client(mock_crisp as never));
  server = Bun.serve({ fetch: router.fetch, port: 0 });
});
afterAll(() => server.stop(true));

//

const examples = [
  {
    add_member: "EN TANT QU'INTERNE",
    add_domain: "yopmail.com en interne à l'organisation",
    cause: "domaine vérifié",
  },
  {
    add_member: "EN TANT QU'EXTERNE",
    add_domain: "yopmail.com en externe à l'organisation",
    cause: "domaine externe vérifié",
  },
];

for (const { add_member, add_domain, cause } of examples) {
  describe(
    `Valider les modérations similaires - ${add_member}`,
    Scenario(
      () => `http://localhost:${server.port}`,
      ({ I, within }) => {
        beforeAll(identite_empty_database);
        beforeAll(hyyyperbase_empty_database);
        beforeAll(() => insert_database(pg));
        beforeAll(() => insert_moderateur(hyyyper_pglite));
        I.navigate("/moderations");
        I.see_in_title("Liste des moderations");
        I.see("Liste des moderations");
        I.click_link("Modération a traiter de Jean Bon pour 51935970700022");
        I.see_in_title("Modération a traiter de Jean Bon pour 51935970700022");
        I.click("✅ Accepter");
        I.see(
          "A propos de jeanbon@yopmail.com pour l'organisation Abracadabra (ABRACADABRA), je valide :",
        );
        within("la modale de validation", ({ I }) => {
          I.click(add_member);
          I.click("J'autorise le domaine " + add_domain);
          I.click("Terminer");
        });
        I.click("Annuler");
        I.see("Cette modération a été marqué comme traitée le");
        I.see("Validé par moderateur@beta.gouv.fr");
        I.click("Moderations");
        I.see_in_title("Liste des moderations");
        I.fill_and_submit("Filtrer les modérations…", "is:processed");
        I.not_see("Jean Bon");
        I.not_see("Jean Dré");
        I.fill_and_submit(
          "Filtrer les modérations…",
          "is:processed siret:51935970700022",
        );
        I.click_link("Modération a traiter de Jean Dré pour 51935970700022");
        I.see_in_title("Modération a traiter de Jean Dré pour 51935970700022");
        I.see("Validation automatique - " + cause);
      },
    ),
  );
}
