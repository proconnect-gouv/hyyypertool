import { set_crisp_client } from "#src/middleware/crisp";
import { create_testing_router } from "#src/testing";
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
import { Scenario } from "bun-webview-dsl";
import { afterAll, beforeAll, beforeEach, describe, mock } from "bun:test";

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
beforeEach(identite_empty_database);
beforeEach(hyyyperbase_empty_database);
beforeEach(() => insert_database(pg));
beforeEach(() => insert_moderateur(hyyyper_pglite));

//

const examples = [
  {
    type_verification: "Mail officiel",
    verification_enum: "official_contact_email",
  },
  {
    type_verification: "Liste des dirigeants RNA",
    verification_enum: "in_liste_dirigeants_rna",
  },
  {
    type_verification: "Liste des dirigeants RNE",
    verification_enum: "in_liste_dirigeants_rne",
  },
  {
    type_verification: "Justificatif transmis",
    verification_enum: "proof_received",
  },
  {
    type_verification: "Domaine d'ordre professionnel",
    verification_enum: "ordre_professionnel_domain",
  },
];

for (const { type_verification, verification_enum } of examples) {
  describe(
    `Sélectionner ${type_verification}`,
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
          I.click("EN TANT QU'INTERNE");
          I.click(type_verification);
          I.click("Terminer");
        });
        I.click("Annuler");
        I.see("Cette modération a été marqué comme traitée le");
        I.see("Validé par moderateur@beta.gouv.fr");
        I.click("Moderations");
        I.see_in_title("Liste des moderations");
        I.see("Liste des moderations");
        I.fill_and_submit("Filtrer les modérations…", "is:processed");
        I.click_link("Modération a traiter de Jean Bon pour 51935970700022");
        I.click("👥 1 membre connu dans l'organisation");
        I.see_table("👥 1 membre connu dans l'organisation", [
          ["Jean", "Bon", verification_enum],
        ]);
      },
    ),
  );
}
