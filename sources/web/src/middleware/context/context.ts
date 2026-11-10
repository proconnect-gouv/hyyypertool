//

import type { AppVariablesContext } from "#src/config";
import type { AuthorizedContext } from "../auth";
import type { CrispClientContext } from "../crisp";
import type { CspContext } from "../csp";
import type { FetchVariablesContext } from "../fetch";
import type { HyyyperbasePgContext } from "../hyyyperbase";
import type { IdentiteProconnectPgContext } from "../identite-pg";
import type { IdentiteRuntimeContext } from "../identite-runtime";
import type { NonceVariablesContext } from "../nonce/set_nonce";
import type { SentryVariablesContext } from "../sentry";
import type { SessionContext } from "../session";

//

export type AppContext = AppVariablesContext &
  AuthorizedContext &
  CrispClientContext &
  CspContext &
  FetchVariablesContext &
  HyyyperbasePgContext &
  IdentiteProconnectPgContext &
  IdentiteRuntimeContext &
  NonceVariablesContext &
  SentryVariablesContext &
  SessionContext;

export type AdminAppContext = AppContext;
