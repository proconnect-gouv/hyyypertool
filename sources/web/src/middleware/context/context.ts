//

import type { AppVariablesContext } from "#src/config";
import type {
  HyyyperUserContext,
  PartialHyyyperUserContext,
  UserInfoVariablesContext,
} from "../auth";
import type { CrispClientContext } from "../crisp";
import type { CspContext } from "../csp";
import type { FetchVariablesContext } from "../fetch";
import type { HyyyperbasePgContext } from "../hyyyperbase";
import type { IdentiteProconnectPgContext } from "../identite-pg";
import type { NonceVariablesContext } from "../nonce/set_nonce";
import type { SentryVariablesContext } from "../sentry";
import type { SessionContext } from "../session";

//

export type AppContext = AppVariablesContext &
  CrispClientContext &
  CspContext &
  FetchVariablesContext &
  HyyyperbasePgContext &
  PartialHyyyperUserContext &
  IdentiteProconnectPgContext &
  NonceVariablesContext &
  SentryVariablesContext &
  SessionContext &
  UserInfoVariablesContext;

export type AdminAppContext = AppContext & HyyyperUserContext;
