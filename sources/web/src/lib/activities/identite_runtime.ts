//

import type { IdentiteProconnectPgDatabase } from "@~/identite-proconnect/database";
import { createIdentiteRuntime } from "@proconnect-gouv/proconnect.identite.runtime";
import type { HyyypertoolActivityContexts } from "./contexts";

//

export function identite_runtime(db: IdentiteProconnectPgDatabase) {
  return createIdentiteRuntime<HyyypertoolActivityContexts>({
    app: "hyyypertool",
    db,
  });
}
