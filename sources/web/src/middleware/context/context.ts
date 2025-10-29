//

import type { AppVariables_Context } from "#src/config";
import type { Csp_Context } from "#src/middleware/csp/csp_headers";
import type { IdentiteProconnect_Pg_Context } from "#src/middleware/identite-pg/set_identite_pg";
import type { Scope } from "@sentry/core";
import type { Env } from "hono";
import type { Session } from "hono-sessions";
import type { UserInfoResponse } from "openid-client";

//

/**
 * @deprecated use web version after this file migration
 */
export interface AgentConnect_UserInfo extends UserInfoResponse {
  sub: string;
  given_name: string;
  usual_name: string;
  email: string;
  siret: string;
  phone_number: string;
}

/**
 * @deprecated use web version after this file migration
 */
interface SessionKeyMapping {
  userinfo?: AgentConnect_UserInfo;
  idtoken: string;
  state: string;
  nonce: string;
}

//

/**
 * @deprecated use web version after this file migration
 */
export interface Session_Context extends Env {
  Variables: {
    session: Omit<Session, "get" | "set"> & {
      get<K extends keyof SessionKeyMapping>(key: K): SessionKeyMapping[K];
      set<K extends keyof SessionKeyMapping>(
        key: K,
        value: SessionKeyMapping[K],
      ): void;
    };
  };
}

/**
 * @deprecated use web version after this file migration
 */
export interface NonceVariables_Context extends Env {
  Variables: {
    readonly nonce: string;
  };
}

/**
 * @deprecated use web version after this file migration
 */
export interface UserInfoVariables_Context extends Env {
  Variables: {
    userinfo: AgentConnect_UserInfo;
  };
}

/**
 * @deprecated use web version after this file migration
 */
export interface SentryVariables_Context extends Env {
  Variables: {
    sentry: Scope;
    sentry_trace_meta_tags: string;
  };
}
export type App_Context = AppVariables_Context &
  Csp_Context &
  IdentiteProconnect_Pg_Context &
  NonceVariables_Context &
  Session_Context &
  UserInfoVariables_Context &
  SentryVariables_Context;
