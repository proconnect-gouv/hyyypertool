import { set_userinfo } from "#src/middleware/auth";
import { set_config } from "#src/middleware/config";
import { set_hyyyper_pg } from "#src/middleware/hyyyperbase";
import { set_identite_pg, set_identite_pg_client } from "#src/middleware/identite-pg";
import { set_nonce } from "#src/middleware/nonce";
import { create_asset_router } from "#src/routes/assets";
import {
  empty_database as hyyyperbase_empty_database,
  hyyyper_pglite,
} from "@~/hyyyperbase/testing";
import { insert_moderateur } from "@~/hyyyperbase/testing/users";
import { insert_database } from "@~/identite-proconnect/database/seed/insert";
import {
  empty_database as identite_empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/database/testing";
import { afterAll, beforeAll, beforeEach } from "bun:test";
import { Scenario } from "bun-webview-dsl";
import { Hono } from "hono";
import app from "./index";

//

const MODERATOR = {
  email: "moderateur@beta.gouv.fr",
  sub: "oidc-sub-moderateur",
};

const ASSETS_PATH = "/assets/test-v123";
const PUBLIC_ASSETS_PATH = `${ASSETS_PATH}/public/built`;

let server: ReturnType<typeof Bun.serve>;
beforeAll(migrate);
beforeAll(() => {
  const hono = new Hono()
    .onError((e) => {
      throw e;
    })
    .use(
      set_config({
        ASSETS_PATH,
        PUBLIC_ASSETS_PATH,
        VERSION: "test-v123",
        NODE_ENV: "test",
        DEPLOY_ENV: "preview",
        SENTRY_DNS: undefined,
        SENTRY_TRACES_SAMPLE_RATE: 0,
        SENTRY_PROFILES_SAMPLE_RATE: 0,
        ALLOWED_USERS: "",
        POLL_INTERVAL: 11,
        HTTP_CLIENT_TIMEOUT: 3_000,
        CRISP_BASE_URL: "https://api.crisp.chat",
        CRISP_IDENTIFIER: "",
        CRISP_KEY: "",
        CRISP_PLUGIN_URN: "",
        CRISP_USER_NICKNAME: "",
        CRISP_WEBSITE_ID: "",
        CRISP_RESOLVE_DELAY: 2_000,
        API_AUTH_URL: "https://auth.example.com",
        API_AUTH_USERNAME: "",
        API_AUTH_PASSWORD: "",
        AGENTCONNECT_OIDC_CLIENT_ID: "",
        AGENTCONNECT_OIDC_ISSUER: "https://agentconnect.example.com",
        AGENTCONNECT_OIDC_SECRET_ID: "",
      }),
    )
    .use(set_hyyyper_pg(hyyyper_pglite))
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo(MODERATOR))
    .route(
      ASSETS_PATH,
      create_asset_router({
        assets_path: ASSETS_PATH,
        node_modules_root: ".",
        public_root: "./bin",
      }),
    )
    .route("/moderations", app);
  server = Bun.serve({ fetch: hono.fetch });
});
afterAll(() => server.stop(true));
beforeEach(identite_empty_database);
beforeEach(hyyyperbase_empty_database);
beforeEach(() => insert_database(pg));
beforeEach(() => insert_moderateur(hyyyper_pglite));

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
  Scenario(
    `Valider les modérations similaires - ${add_member}`,
    () => `http://localhost:${server.port}`,
    ({ I }) => {
      I.navigate("/moderations");
      I.see_in_title("Liste des moderations");
      I.see("Liste des moderations");
      I.click_link("Modération a traiter de Jean Bon pour 51935970700022");
      I.see_in_title("Modération a traiter de Jean Bon pour 51935970700022");
      I.click("✅ Accepter");
      I.see(
        "A propos de jeanbon@yopmail.com pour l'organisation Abracadabra (ABRACADABRA), je valide :",
      );
      I.within("la modale de validation").click(add_member);
      I.within("la modale de validation").click("J'autorise le domaine " + add_domain);
      I.within("la modale de validation").click("Terminer");
      I.click("Annuler");
      I.see("Cette modération a été marqué comme traitée le");
      I.see("Validé par moderateur@beta.gouv.fr");
      I.click("Moderations");
      I.see_in_title("Liste des moderations");
      I.fill_and_submit("Filtrer les modérations…", "is:processed");
      I.not_see("Jean Bon");
      I.not_see("Jean Dré");
      I.fill_and_submit("Filtrer les modérations…", "is:processed siret:51935970700022");
      I.click_link("Modération a traiter de Jean Dré pour 51935970700022");
      I.see_in_title("Modération a traiter de Jean Dré pour 51935970700022");
      I.see("Validation automatique - " + cause);
    },
  );
}
