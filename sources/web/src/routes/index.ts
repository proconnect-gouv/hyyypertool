//

import config from "#src/config";
import { Root_Layout } from "#src/layouts";
import { set_userinfo } from "#src/middleware/auth";
import { set_config } from "#src/middleware/config";
import { set_crisp_client_from_config } from "#src/middleware/crisp";
import { set_identite_pg_database } from "#src/middleware/identite-pg";
import { set_nonce } from "#src/middleware/nonce";
import { set_sentry } from "#src/middleware/sentry";
import consola from "consola";
import { Hono } from "hono";
import auth_router from "./auth";
import domains_deliverability_router from "./domains-deliverability";
import moderations_router from "./moderations";
import organizations_router from "./organizations";
import proxy_router from "./proxy";
import users_router from "./users";
import welcome_router from "./welcome";
// TODO: Re-enable compression when Bun supports CompressionStream
// import { compress } from "hono/compress";
import { hyyyyyypertool_session } from "#src/middleware/session";
import { contextStorage } from "hono/context-storage";
import { jsxRenderer } from "hono/jsx-renderer";
import { logger } from "hono/logger";
import asserts_router from "./assets";
import { error_handler } from "./error";
import { not_found_handler } from "./not-found";
import readyz_router from "./readyz";

//

const app = new Hono()
  .use(logger(consola.info))
  .use(contextStorage())
  // TODO: Re-enable compression when Bun supports CompressionStream
  // .use(compress())
  .use(set_sentry())
  .use(set_nonce())
  .use(set_config())

  .get("/healthz", ({ text }) => text(`healthz check passed`))
  .get("/livez", ({ text }) => text(`livez check passed`))

  .route(config.ASSETS_PATH, asserts_router)
  .route("/readyz", readyz_router)

  //

  .route("/proxy", proxy_router)

  //

  .use(hyyyyyypertool_session)
  .use(jsxRenderer(Root_Layout))
  .use(set_userinfo())
  //
  .route("/", welcome_router)
  .route("/auth", auth_router)
  //
  .use(set_crisp_client_from_config())
  .use(set_identite_pg_database({ connectionString: config.DATABASE_URL }))
  //

  .route("/moderations", moderations_router)

  .route("/users", users_router)

  .route("/organizations", organizations_router)

  .route("/domains-deliverability", domains_deliverability_router)

  .onError(error_handler)
  .notFound(not_found_handler);

//

export type Router = typeof app;
export default app;
