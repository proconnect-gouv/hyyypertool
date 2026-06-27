import { set_userinfo } from "#src/middleware/auth";
import { set_config } from "#src/middleware/config";
import { set_hyyyper_pg } from "#src/middleware/hyyyperbase";
import { set_identite_pg } from "#src/middleware/identite-pg";
import { set_nonce } from "#src/middleware/nonce";
import { create_asset_router } from "#src/routes/assets";
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
import { afterAll, beforeAll, beforeEach } from "bun:test";
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
        AGENTCONNECT_OIDC_CLIENT_ID: "",
        AGENTCONNECT_OIDC_ISSUER: "https://agentconnect.example.com",
        AGENTCONNECT_OIDC_SECRET_ID: "",
        ALLOWED_USERS: "",
        API_AUTH_PASSWORD: "",
        API_AUTH_URL: "https://auth.example.com",
        API_AUTH_USERNAME: "",
        ASSETS_PATH,
        CRISP_BASE_URL: "https://api.crisp.chat",
        CRISP_IDENTIFIER: "",
        CRISP_KEY: "",
        CRISP_PLUGIN_URN: "",
        CRISP_RESOLVE_DELAY: 2_000,
        CRISP_USER_NICKNAME: "",
        CRISP_WEBSITE_ID: "",
        DEPLOY_ENV: "preview",
        HTTP_CLIENT_TIMEOUT: 3_000,
        NODE_ENV: "test",
        POLL_INTERVAL: 11,
        PUBLIC_ASSETS_PATH,
        SENTRY_DNS: undefined,
        SENTRY_PROFILES_SAMPLE_RATE: 0,
        SENTRY_TRACES_SAMPLE_RATE: 0,
        VERSION: "test-v123",
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

Scenario(
  "Moderator can see the user details",
  () => `http://localhost:${server.port}`,
  ({ I }) => {
    I.navigate("/moderations");
    I.see("Liste des moderations");
    I.click_link("Modération a traiter de Jean Bon pour 13002526500013");
    I.see("jeanbon@yopmail.com");
  },
);

Scenario(
  "Moderator can see the user's organizations",
  () => `http://localhost:${server.port}`,
  ({ I }) => {
    I.navigate("/moderations");
    I.click_link("Modération a traiter de Jean Bon pour 13002526500013");
    I.see("organisation connu");
  },
);

Scenario(
  "Moderator can see the target organization's members",
  () => `http://localhost:${server.port}`,
  ({ I }) => {
    I.navigate("/moderations");
    I.click_link("Modération a traiter de Jean Bon pour 13002526500013");
    I.see("membre connu");
  },
);

Scenario(
  "Moderator can go back to the list",
  () => `http://localhost:${server.port}`,
  ({ I }) => {
    I.navigate("/moderations");
    I.click_link("Modération a traiter de Jean Bon pour 13002526500013");
    I.see("jeanbon@yopmail.com");
    I.click("retour");
    I.see_in_title("Liste des moderations");
  },
);
