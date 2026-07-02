import { set_userinfo } from "../middleware/auth";
import { set_config } from "../middleware/config";
import { set_hyyyper_pg } from "../middleware/hyyyperbase";
import { set_identite_pg } from "../middleware/identite-pg";
import { set_fetch } from "../middleware/fetch";
import { set_crisp_client } from "../middleware/crisp";
import { set_nonce } from "../middleware/nonce";
import { create_asset_router } from "../routes/assets";
import { create_router } from "#src/router";
import { hyyyper_pglite } from "@~/hyyyperbase/testing";
import {
  client as identite_pg_client,
  pg,
} from "@~/identite-proconnect/database/testing";
import { Hono } from "hono";

export const ASSETS_PATH = "/assets/test-v123";
export const PUBLIC_ASSETS_PATH = `${ASSETS_PATH}/public/built`;
export const MODERATOR = {
  email: "moderateur@beta.gouv.fr",
  sub: "oidc-sub-moderateur",
};

export function create_testing_router() {
  return new Hono()
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
        CRISP_RESOLVE_DELAY: 0,
        API_AUTH_URL: "https://auth.example.com",
        API_AUTH_USERNAME: "",
        API_AUTH_PASSWORD: "",
        AGENTCONNECT_OIDC_CLIENT_ID: "",
        AGENTCONNECT_OIDC_ISSUER: "https://agentconnect.example.com",
        AGENTCONNECT_OIDC_SECRET_ID: "",
        ENTREPRISE_API_GOUV_URL: "https://entreprise.api.example.com",
        ENTREPRISE_API_GOUV_TOKEN: "",
      }),
    )
    .use(set_hyyyper_pg(hyyyper_pglite))
    .use(set_identite_pg(pg))
    .use(async ({ set }, next) => {
      set("identite_pg_client", identite_pg_client as any);
      await next();
    })
    .use(
      set_crisp_client({
        create_conversation: async () => ({ session_id: "test-session" }),
        get_user: async () => null,
        send_message: async () => undefined,
        mark_conversation_as_resolved: async () => undefined,
      } as never),
    )
    .use(set_nonce("nonce"))
    .use(set_fetch())
    .use(set_userinfo(MODERATOR))
    .route(
      ASSETS_PATH,
      create_asset_router({
        assets_path: ASSETS_PATH,
        node_modules_root: ".",
        public_root: "./bin",
      }),
    )
    .route("/", create_router());
}
