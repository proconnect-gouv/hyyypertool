import { CrispMessageSchema, type CrispApi } from "#src/lib/crisp";
import { create_router } from "#src/router";
import { hyyyper_pglite } from "@~/hyyyperbase/testing";
import {
  client as identite_pg_client,
  pg,
} from "@~/identite-proconnect/database/testing";
import { Hono } from "hono";
import { authorized, set_userinfo } from "../middleware/auth";
import { set_config } from "../middleware/config";
import { set_crisp_client } from "../middleware/crisp";
import { set_fetch } from "../middleware/fetch";
import { set_hyyyper_pg } from "../middleware/hyyyperbase";
import { set_identite_pg } from "../middleware/identite-pg";
import { set_identite_runtime } from "../middleware/identite-runtime";
import { set_nonce } from "../middleware/nonce";
import {
  crisp_messages_batch,
  seeded_crisp_messages,
  seeded_crisp_subject,
} from "../routes/___dev___/api.crisp.chat/messages";
import { create_asset_router } from "../routes/assets";

const ASSETS_PATH = "/assets/test-v123";
const PUBLIC_ASSETS_PATH = `${ASSETS_PATH}/public/built`;
const MODERATOR = {
  email: "moderateur@beta.gouv.fr",
  sub: "oidc-sub-moderateur",
};

export function create_test_fetch(): (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response> {
  const json = (status: number, body: unknown) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { "content-type": "application/json" },
    });
  return async (input, init) => {
    const url = String(input instanceof Request ? input.url : input);
    if (url.startsWith("https://entreprise.api.example.com/")) {
      return json(200, { data: { documents_rna: [] } });
    }
    if (url.startsWith("https://auth.example.com/")) {
      return json(200, {});
    }
    if (url.startsWith("https://banatic.example.com/")) {
      return new Response(null, { status: 200 });
    }
    return fetch(input, init);
  };
}

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
        HTTP_CLIENT_TIMEOUT: 1_000,
        CRISP_BASE_URL: "https://api.crisp.chat",
        CRISP_IDENTIFIER: "",
        CRISP_KEY: "",
        CRISP_PLUGIN_URN: "urn:test",
        CRISP_USER_NICKNAME: "",
        CRISP_WEBSITE_ID: "",
        CRISP_RESOLVE_DELAY: 0,
        BANATIC_BASE_URL: "https://banatic.example.com",
        API_AUTH_URL: "https://auth.example.com",
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
        get_conversation: async ({ session_id }: { session_id: string }) => ({
          created_at: 1_700_000_000_000,
          last_message: "",
          meta: {
            avatar: "",
            data: {},
            device: {},
            email: "user@example.com",
            ip: "",
            nickname: "User",
            phone: "",
            segments: ["email"],
            subject: await seeded_crisp_subject(pg, session_id),
          },
        }),
        get_messages: async ({ session_id, timestamp_before }) =>
          crisp_messages_batch(
            seeded_crisp_messages(session_id, "test"),
            timestamp_before,
          ).map((message) => CrispMessageSchema.parse(message)),
        get_user: async () => {
          throw new Error("operator not found");
        },
        mark_conversation_as_resolved: async () => undefined,
        send_message: async () => ({ fingerprint: 0 }),
      } satisfies CrispApi),
    )
    .use(set_nonce("nonce"))
    .use(set_fetch(create_test_fetch()))
    .use(set_userinfo(MODERATOR))
    .route(
      ASSETS_PATH,
      create_asset_router({
        assets_path: ASSETS_PATH,
        node_modules_root: ".",
        public_root: "./bin",
      }),
    )
    .use(authorized())
    .use(set_identite_runtime())
    .route("/", create_router());
}
