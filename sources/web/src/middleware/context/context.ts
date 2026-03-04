//

import type { AppVariablesContext } from "#src/config";
import type { UserInfoVariablesContext } from "../auth";
import type { CrispClientContext } from "../crisp";
import type { CspContext } from "../csp";
import type { FetchVariablesContext } from "../fetch";
import type { HyyyperbasePgContext } from "../hyyyyperbase";
import type { IdentiteProconnectPgContext } from "../identite-pg";
import type { NonceVariablesContext } from "../nonce/set_nonce";
import type { SentryVariablesContext } from "../sentry";
import type { SessionContext } from "../session";

//

export type App_Context = AppVariablesContext &
  CrispClientContext &
  CspContext &
  FetchVariablesContext &
  HyyyperbasePgContext &
  IdentiteProconnectPgContext &
  NonceVariablesContext &
  SentryVariablesContext &
  SessionContext &
  UserInfoVariablesContext;
