//
// Compatibility shim - type definitions only
// Domain packages use these types but shouldn't import from middleware
// TODO: Refactor domain libs to accept domain-specific types instead of middleware context

import type { Scope } from "@sentry/core";
import type { Env } from "hono";
import type { Session } from "hono-sessions";
import type { UserInfoResponse } from "openid-client";

//

/**
 * @deprecated Domain libs should not depend on middleware context
 * Use domain-specific parameter types instead
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
 * @deprecated Domain libs should not depend on middleware context
 */
interface SessionKeyMapping {
  userinfo?: AgentConnect_UserInfo;
  idtoken: string;
  state: string;
  nonce: string;
}

//

/**
 * @deprecated Domain libs should not depend on middleware context
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
 * @deprecated Domain libs should not depend on middleware context
 */
export interface SentryVariables_Context extends Env {
  Variables: {
    sentry: Scope;
    sentry_trace_meta_tags: string;
  };
}

/**
 * @deprecated Domain libs should not depend on middleware context
 */
export interface AppVariables_Context extends Env {
  Variables: {
    readonly nonce: string;
    readonly page_title: string;
    readonly config: any;
  };
}

/**
 * @deprecated Domain libs should not depend on middleware context
 */
export interface Csp_Context extends Env {
  Variables: {
    csp_headers: Record<string, string>;
  };
}

/**
 * @deprecated Domain libs should not depend on middleware context
 */
export interface IdentiteProconnect_Pg_Context extends Env {
  Bindings: {
    database: any;
  };
}

/**
 * @deprecated Domain libs should not depend on middleware context
 */
export type App_Context = Session_Context &
  SentryVariables_Context &
  AppVariables_Context &
  Csp_Context &
  IdentiteProconnect_Pg_Context;

export { set_variables } from "./context/set_variables";
