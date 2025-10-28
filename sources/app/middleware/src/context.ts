//

import type { AppVariables_Context } from "@~/app.core/config";
import type { SentryVariables_Context } from "@~/web/middleware";
import type { Csp_Context } from "./csp_headers";
import type { Session_Context } from "./session";
import type { IdentiteProconnect_Pg_Context } from "./set_identite_pg";
import type { NonceVariables_Context } from "./set_nonce";
import type { UserInfoVariables_Context } from "./set_userinfo";

export type App_Context = AppVariables_Context &
  Csp_Context &
  IdentiteProconnect_Pg_Context &
  NonceVariables_Context &
  Session_Context &
  UserInfoVariables_Context &
  SentryVariables_Context;
